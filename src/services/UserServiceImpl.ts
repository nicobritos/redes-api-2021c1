import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {UserRepository} from '../interfaces/repositories/UserRepository';
import {AuthService} from '../interfaces/services/AuthService';
import {UserService} from '../interfaces/services/UserService';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {User} from '@models/User';
import TYPES from '../types';
import {ID, Nullable} from '@models/utils/UtilityTypes';
import {Unauthenticated} from '../exceptions/Unauthenticated';
import {assertStringID} from '@models/utils/Utils';
import {childLogger} from '../utils/MainLogger';

@injectable()
export class UserServiceImpl implements UserService {
    private static readonly LOGGER = childLogger(__dirname, 'UserServiceImpl');

    @inject(TYPES.Repositories.UserRepository)
    private repository: UserRepository;

    @inject(TYPES.Services.AuthService)
    private authService: AuthService;

    public async findByEmail(email: string): Promise<Nullable<User>> {
        return UserServiceImpl.removeSensitiveInformation(await this.repository.findByEmail(email));
    }

    public async findById(id: ID): Promise<Nullable<User>> {
        return UserServiceImpl.removeSensitiveInformation(
            await this.repository.findById(assertStringID(id))
        );
    }

    public isEmailAvailable(email: string): Promise<boolean> {
        return this.repository.isEmailAvailable(email);
    }

    public async authenticate(email: string, password: string, ip: string): Promise<AuthenticatedUser> {
        let user = await this.repository.findByEmail(email);
        if (!user)
            throw new Unauthenticated();

        if (!(await this.authService.verifyPassword(password, user.password!)))
            throw new Unauthenticated();

        await this.repository.setLastLoginIp(assertStringID(user.id), ip);
        if (user.ip !== null && user.ip !== ip) {
            UserServiceImpl.LOGGER.alert(JSON.stringify({
                reason: 'login_ip',
                message: 'User login with different IP',
                lastLoginIp: user.ip,
                loginIp: ip
            }));
        }

        return UserServiceImpl.removeSensitiveInformationAuthenticatedUser(
            await this.authService.generateAuthenticatedUser(user)
        );
    }

    private static removeSensitiveInformation(user: Nullable<User>): Nullable<User> {
        if (!user) return user;

        user.password = null;
        user.ip = null;

        return user;
    }

    private static removeSensitiveInformationAuthenticatedUser(authenticatedUser: AuthenticatedUser): AuthenticatedUser {
        this.removeSensitiveInformation(authenticatedUser.user);
        return authenticatedUser;
    }
}
