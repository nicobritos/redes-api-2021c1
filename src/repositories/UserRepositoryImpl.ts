import {inject, injectable} from 'inversify';
import {UserRepository} from '../interfaces/repository/UserRepository';
import {User} from '@models/User';
import TYPES from '../types';
import {EmailAlreadyExists} from '../exceptions/EmailAlreadyExists';
import {CountryAddressRepository} from '../interfaces/repository/CountryAddressRepository';
import {Nullable} from '@models/utils/UtilityTypes';
import {Client} from 'cassandra-driver';
import {UserByIdSchema} from './schemas/UserByIdSchema';
import {plainToClass} from 'class-transformer';
import {IDUtils} from '@models/utils/IDUtils';
import {UserByEmailSchema} from './schemas/UserByEmailSchema';
import {RefreshTokenRedis} from './utils/RefreshTokenRedis';
import {VerificationTokenRedis} from './utils/VerificationTokenRedis';
import {UserByEmailLowercaseSchema} from './schemas/UserByEmailLowercaseSchema';
import {UserByCountryIdSchema} from './schemas/UserByCountryIdSchema';
import {validate} from 'class-validator';

@injectable()
export class UserRepositoryImpl implements UserRepository {
    public static readonly VERIFICATION_TOKEN_REDIS_NAME = 'verification';
    private static readonly VERIFICATION_TOKEN_RANDOM_LENGTH = 256;
    private static readonly VERIFICATION_TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 d

    @inject(TYPES.Repositories.CountryAddressRepository)
    private countryRepository: CountryAddressRepository;
    @inject(TYPES.Clients.CassandraClient)
    private repository: Client;

    public async findById(id: string): Promise<Nullable<User>> {
        let numericId = IDUtils.decodeID(id);

        let result = await this.repository.execute(
            'SELECT * FROM latinbox_purchases.user_by_id WHERE id = ?',
            [ numericId ],
            {
                prepare: true,
                isIdempotent: true
            }
        );

        if (result.rows.length > 0)
            return plainToClass(UserByIdSchema, result.rows[0]).toEntity();
        return null;
    }

    public async findByEmail(email: string): Promise<User> {
        let result = await this.repository.execute(
            'SELECT * FROM latinbox_purchases.user_by_email WHERE email = ?',
            [ email ],
            {
                prepare: true,
                isIdempotent: true
            }
        );

        if (result.rows.length > 0)
            return plainToClass(UserByEmailSchema, result.rows[0]).toEntity();
        return null;
    }

    public async isEmailAvailable(email: string): Promise<boolean> {
        let result = await this.repository.execute(
            'SELECT id FROM latinbox_purchases.user_by_email_lowercase WHERE email = ?',
            [ email.trim().toLowerCase() ],
            {
                prepare: true,
                isIdempotent: true
            }
        );

        return result.rows.length === 0;
    }


    public async generateVerificationToken(userId: string): Promise<string> {
        // userId should be a b32 encoded string
        let token = `${IDUtils.randomString(UserRepositoryImpl.VERIFICATION_TOKEN_RANDOM_LENGTH)}${userId}`;

        let tokenKeyName = UserRepositoryImpl.getVerificationTokenRedisName(token);
        await VerificationTokenRedis.multi()
            .set(tokenKeyName, IDUtils.decodeID(userId).toString(16))
            .expire(tokenKeyName, UserRepositoryImpl.VERIFICATION_TOKEN_EXPIRY_SECONDS)
            .exec();

        return token;
    }

    public async verifyEmail(token: string): Promise<boolean> {
        let redisName = UserRepositoryImpl.getVerificationTokenRedisName(token);

        let userId = (await RefreshTokenRedis.multi()
            .get(redisName)
            .del(redisName)
            .exec()
        )[0][1];

        if (!userId)
            return false;

        userId = Number(userId);

        await this.repository.execute('' +
            'UPDATE latinbox_purchases.user_by_id SET verified = true WHERE id = ?',
            [ userId ],
            {
                prepare: true,
                isIdempotent: true
            }
        );

        return true;
    }

    public async create(user: User): Promise<User> {
        let id = await IDUtils.generateID();
        let numberId = IDUtils.IDToNumber(id);

        user.email = user.email.trim();
        user.id = IDUtils.encodeID(id);

        await UserRepositoryImpl.validateUser(user);

        // Insert if mail doesn't exist (LWT)
        let response = await this.repository.execute(
            'INSERT INTO latinbox_purchases.user_by_email_lowercase (email, id) VALUES (?, ?) IF NOT EXISTS',
            [
                user.email.toLowerCase(),
                numberId
            ],
            {
                prepare: true
            }
        );
        if (!response.wasApplied()) {
            throw new EmailAlreadyExists();
        }

        await this.repository.batch([
            {
                query: 'INSERT INTO latinbox_purchases.user_by_email (email, id, password) VALUES (?, ?, ?)',
                params: [ user.email, numberId, user.password ]
            },
            {
                query: 'INSERT INTO latinbox_purchases.user_by_id (id, "cId", "rId", email, "fName", "lName", verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                params: [ numberId, user.countryId, user.regionId, user.email, user.firstName, user.lastName, false ]
            },
            {
                query: 'INSERT INTO latinbox_purchases.user_by_country_id ("cId", "uId") VALUES (?, ?)',
                params: [ user.countryId, numberId ]
            }
        ]).then(async value => {
            await this.generateVerificationToken(user.id.toString());
        });

        return user;
    }

    public async updatePassword(email: string, hashedPassword: string): Promise<void> {
        await this.repository.execute(
            'UPDATE latinbox_purchases.user_by_email SET password = ? WHERE email = ?',
            [
                hashedPassword,
                email
            ],
            {
                isIdempotent: true,
                prepare: true
            }
        );
    }


    private static async validateUser(user: User): Promise<void> {
        let userByEmailLowercaseSchema = new UserByEmailLowercaseSchema();
        userByEmailLowercaseSchema.emailLowercase = user.email.toLowerCase();
        userByEmailLowercaseSchema.id = IDUtils.decodeID(user.id);

        let userByEmailSchema = new UserByEmailSchema();
        userByEmailSchema.id = userByEmailLowercaseSchema.id;
        userByEmailSchema.email = user.email;
        userByEmailSchema.password = user.password;

        let userByIdSchema = new UserByIdSchema();
        userByIdSchema.id = userByEmailLowercaseSchema.id;
        userByIdSchema.regionId = Number(user.regionId);
        userByIdSchema.countryId = user.countryId.toString();
        userByIdSchema.verified = user.verified;
        userByIdSchema.lastNames = user.lastName;
        userByIdSchema.firstNames = user.firstName;

        let userByCountryIdSchema = new UserByCountryIdSchema();
        userByCountryIdSchema.userId = userByEmailLowercaseSchema.id;
        userByCountryIdSchema.countryId = user.countryId.toString();

        let validations: PromiseLike<any>[] = [
            validate(userByEmailLowercaseSchema),
            validate(userByEmailSchema),
            validate(userByIdSchema),
            validate(userByCountryIdSchema),
        ];

        await Promise.all(validations);
    }

    private static getVerificationTokenRedisName(token: string): string {
        return `${UserRepositoryImpl.VERIFICATION_TOKEN_REDIS_NAME}:${token}`;
    }
}
