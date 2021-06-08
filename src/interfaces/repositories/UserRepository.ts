import {User} from '@models/User';
import {Nullable} from '@models/utils/UtilityTypes';

export interface UserRepository {
    findById(id: string): Promise<Nullable<User>>;
    findByEmail(email: string): Promise<Nullable<User>>;
    isEmailAvailable(email: string): Promise<boolean>;

    generateVerificationToken(token: string): Promise<string>;
    verifyEmail(token: string): Promise<boolean>;
    create(user: User): Promise<User>;
    updatePassword(email: string, hashedPassword: string): Promise<void>;
}
