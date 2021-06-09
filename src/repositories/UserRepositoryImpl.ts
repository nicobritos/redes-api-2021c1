import {injectable} from 'inversify';
import {getManager} from 'typeorm';
import {UserSchema} from '../interfaces/repositories/schemas/UserSchema';
import {UserRepository} from '../interfaces/repositories/UserRepository';
import {User} from '@models/User';
import {assertStringID} from '@models/utils/Utils';
import {AbstractRepositoryImpl} from './utils/AbstractRepositoryImpl';
import {Nullable} from '@models/utils/UtilityTypes';

@injectable()
export class UserRepositoryImpl extends AbstractRepositoryImpl<User, UserSchema> implements UserRepository {
    public async findByEmail(email: string): Promise<Nullable<User>> {
        return this.toEntity((await this.repository.findOne({
            where: {
                email: email
            }
        })) || null);
    }

    public async findById(id: string): Promise<Nullable<User>> {
        return this.internalFindById(id);
    }

    public async isEmailAvailable(email: string): Promise<boolean> {
        return (await this.repository.count({
            where: {
                email: email
            }
        })) == 0;
    }

    public async toEntity(schema: Nullable<UserSchema>): Promise<Nullable<User>> {
        if (!schema) return null;

        let user = new User();
        user.id = schema.id!;
        user.email = schema.email;
        user.password = schema.password;
        user.firstName = schema.firstName;
        user.lastName = schema.lastName;

        return user;
    }

    public async toSchema(user: Nullable<User>): Promise<Nullable<UserSchema>> {
        if (!user) return null;

        let schema = new UserSchema();

        if (user.id)
            schema.id = assertStringID(user.id);
        if (user.password)
            schema.password = user.password;

        schema.email = user.email;
        schema.firstName = user.firstName;
        schema.lastName = user.lastName;

        return schema;
    }

    protected createRepository() {
        this.repository = getManager().getRepository(UserSchema);
    }
}
