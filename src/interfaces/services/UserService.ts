import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {Country} from '@models/Country';
import {User} from '@models/User';
import {ID} from '@models/utils/UtilityTypes';

export interface UserService {
    // findAll(options: UserPaginationOptions): Promise<Pagination<User>>;

    findById(id: ID): Promise<User>;
    findByEmail(email: string): Promise<User>;

    isEmailAvailable(email: string): Promise<boolean>;

    create(email: string, password: string, firstName: string, lastName: string, country?: Country): Promise<AuthenticatedUser>;
    update(user: User): Promise<User>;
    setPassword(user: User): Promise<AuthenticatedUser>;

    verifyEmail(token: string): Promise<true>;

    applySeller(user: User): Promise<true>;

    verifySeller(user: User): Promise<true>;
    isSellerVerified(user: User): Promise<boolean>;

    authenticate(email: string, password: string): Promise<AuthenticatedUser>;
}
