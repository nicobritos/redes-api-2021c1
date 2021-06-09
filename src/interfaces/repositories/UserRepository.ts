import {User} from '@models/User';
import {Nullable} from '@models/utils/UtilityTypes';

export interface UserRepository {
    findById(id: string): Promise<Nullable<User>>;
    findByEmail(email: string): Promise<Nullable<User>>;
    isEmailAvailable(email: string): Promise<boolean>;
}
