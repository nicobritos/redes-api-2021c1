import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {UserRepository} from '../interfaces/repository/UserRepository';
import {AuthService} from '../interfaces/services/AuthService';
import {CountryService} from '../interfaces/services/CountryService';
import {UserService} from '../interfaces/services/UserService';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {Country} from '@models/Country';
import {User} from '@models/User';
import TYPES from '../types';
import {ID} from '@models/utils/UtilityTypes';
import {NotFound} from '../exceptions/NotFound';
import {Unauthenticated} from '../exceptions/Unauthenticated';
import {CountryNotFound} from '../exceptions/CountryNotFound';
import {PasswordTooWeak} from '../exceptions/PasswordTooWeak';
import {InvalidEmail} from '../exceptions/InvalidEmail';
import {EmailService} from '../interfaces/services/EmailService';
import {assertB32ID} from '@models/utils/Utils';
import {NotImplemented} from '../exceptions/NotImplemented';

@injectable()
export class UserServiceImpl implements UserService {
    @inject(TYPES.Repositories.UserRepository)
    private repository: UserRepository;

    @inject(TYPES.Services.CountryService)
    private countryService: CountryService;
    @inject(TYPES.Services.EmailService)
    private emailService: EmailService;
    @inject(TYPES.Services.AuthService)
    private authService: AuthService;

    public async create(email: string, password: string, firstName: string, lastName: string, country?: Country): Promise<AuthenticatedUser> {
        let user = new User();

        if (!User.VALIDATORS.EMAIL_VALIDATOR.test(email))
            throw new InvalidEmail();
        if (!User.VALIDATORS.PASSWORD_REGEX.test(password))
            throw new PasswordTooWeak();

        user.password = await this.authService.hashPassword(password);
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.isAdmin = false;

        if (country) {
            country = await this.countryService.findById(country.id);
            if (!country)
                throw new CountryNotFound();
            user.countryId = country.id;
        }

        user = await this.repository.create(user);

        await this.emailService.sendWelcomeVerificationEmail({
            email: user.email,
            name: user.firstName,
            token: user.verificationToken
        });

        return UserServiceImpl.removeSensitiveInformationAuthenticatedUser(
            await this.authService.generateAuthenticatedUser(user)
        );
    }

    // public async findAll(options: UserPaginationOptions): Promise<Pagination<User>> {
    //     if (options.first <= 0 || options.after < 0) throw new RangeError();
    //     if (options.first > UserServiceImpl.MAX_PAGINATION) options.first = UserServiceImpl.MAX_PAGINATION;
    //
    //     let paginationInformation = await this.repository.findAll(options);
    //     return new Pagination(
    //         paginationInformation.data.map(value => UserServiceImpl.removeSensitiveInformation(value)),
    //         paginationInformation.pageInfo,
    //         paginationInformation.aggregation
    //     );
    // }

    public async findByEmail(email: string): Promise<User> {
        return UserServiceImpl.removeSensitiveInformation(await this.repository.findByEmail(email));
    }

    public async findById(id: ID): Promise<User> {
        return UserServiceImpl.removeSensitiveInformation(
            await this.repository.findById(assertB32ID(id))
        );
    }

    public isEmailAvailable(email: string): Promise<boolean> {
        if (!User.VALIDATORS.EMAIL_VALIDATOR.test(email))
            throw new InvalidEmail();

        return this.repository.isEmailAvailable(email);
    }

    public async authenticate(email: string, password: string): Promise<AuthenticatedUser> {
        let user = await this.repository.findByEmail(email);
        if (user == null)
            throw new Unauthenticated();

        if (!(await this.authService.verifyPassword(password, user.password)))
            throw new Unauthenticated();

        return UserServiceImpl.removeSensitiveInformationAuthenticatedUser(
            await this.authService.generateAuthenticatedUser(user)
        );
    }

    public async setPassword(user: User): Promise<AuthenticatedUser> {
        if (!User.VALIDATORS.PASSWORD_REGEX.test(user.password))
            throw new PasswordTooWeak();

        let userId = assertB32ID(user.id);
        let userDb = await this.repository.findById(userId);
        if (userDb == null)
            throw new NotFound();

        userDb.password = await this.authService.hashPassword(user.password);

        let promises: PromiseLike<any>[] = [
            this.repository.updatePassword(user.email, userDb.password),
            this.authService.invalidate(userDb.id)
        ];

        await Promise.all(promises);

        return UserServiceImpl.removeSensitiveInformationAuthenticatedUser(
            await this.authService.generateAuthenticatedUser(user)
        );
    }

    public async update(user: User): Promise<User> {
        throw new NotImplemented();

        // if (!User.VALIDATORS.EMAIL_VALIDATOR.test(user.email))
        //     throw new InvalidEmail();
        //
        // let loadedUser = await this.repository.findById(assertB32ID(user.id));
        // if (loadedUser == null)
        //     throw new NotFound();
        //
        // let newCountry = await this.countryService.findById(user.countryId);
        // if (!newCountry)
        //     throw new CountryNotFound();
        //
        // let otherUser = await this.findByEmail(user.email);
        // if (otherUser != null && user.id === otherUser.id) {
        //     throw new EmailAlreadyExists();
        // } else if (otherUser == null) {
        //     // TODO Should resend verification email
        // }
        //
        // loadedUser.email = user.email;
        // loadedUser.countryId = newCountry.id;
        //
        // return UserServiceImpl.removeSensitiveInformation(await this.repository.(loadedUser));
    }

    public async verifyEmail(token: string): Promise<true> {
        if (!(await this.repository.verifyEmail(token)))
            throw new NotFound();
        return true;
    }

    public async applySeller(user: User): Promise<true> {
        throw new NotImplemented();

        // user = await this.repository.findById(assertStringID(user.id));
        // if (user == null)
        //     throw new NotFound();
        // if (user.verified || user.pendingVerification)
        //     throw new AlreadySet();
        //
        // user.pendingVerification = true;
        // await this.repository.update(user);
    }

    public async isSellerVerified(user: User): Promise<boolean> {
        throw new NotImplemented();

        // user = await this.repository.findById(assertStringID(user.id));
        // if (!user)
        //     throw new NotFound();
        //
        // return user.verified;
    }

    public async verifySeller(user: User): Promise<true> {
        throw new NotImplemented();

        // user = await this.repository.findById(assertStringID(user.id));
        // if (user == null)
        //     throw new NotFound();
        // if (user.verified || !user.pendingVerification)
        //     throw new AlreadySet();
        //
        // await this.repository.update(user);
        //
    }

    private static removeSensitiveInformation(user: User): User {
        user.password = null;
        user.verificationToken = null;
        return user;
    }

    private static removeSensitiveInformationAuthenticatedUser(authenticatedUser: AuthenticatedUser): AuthenticatedUser {
        this.removeSensitiveInformation(authenticatedUser.user);
        return authenticatedUser;
    }
}
