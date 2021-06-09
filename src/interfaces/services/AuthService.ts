import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {JwtToken} from '@models/JwtToken';
import {User} from '@models/User';
import {ID, Nullable} from '@models/utils/UtilityTypes';

export interface AuthService {
    hashPassword(password: string): Promise<string>;

    verifyPassword(password: string, hash: string): Promise<boolean>;
    
    generateJwtToken(user: User): string;
    
    decodeJwtToken(token: string): Nullable<JwtToken>;

    generateAuthenticatedUser(user: User): Promise<AuthenticatedUser>;
}
