import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {User} from '@models/User';
import {ID, Nullable} from '@models/utils/UtilityTypes';

export interface UserService {
    findById(id: ID): Promise<Nullable<User>>;
    findByEmail(email: string): Promise<Nullable<User>>;

    isEmailAvailable(email: string): Promise<boolean>;

    authenticate(email: string, password: string, ip: string): Promise<AuthenticatedUser>;
}
