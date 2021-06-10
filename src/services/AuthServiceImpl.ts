import * as bcrypt from 'bcrypt';
import {injectable} from 'inversify';
import * as jwt from 'jsonwebtoken';
import {AuthService} from '../interfaces/services/AuthService';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {JwtToken} from '@models/JwtToken';
import {AuthUser, User} from '@models/User';
import {Nullable} from '@models/utils/UtilityTypes';
import {DateTime} from 'luxon';

@injectable()
export class AuthServiceImpl implements AuthService {
    public static readonly JWT_EXPIRATION_MILLIS = 15 * 60 * 60 * 24 * 1000; // 15 days in ms

    private static readonly ROUNDS = 12;

    public hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, AuthServiceImpl.ROUNDS);
    }

    public verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    public generateJwtToken(user: User): string {
        // Date.now returns milliseconds
        let exp = Date.now() + AuthServiceImpl.JWT_EXPIRATION_MILLIS;
        let jwtToken = new JwtToken(Date.now(), exp, user.id, new AuthUser(user, DateTime.fromMillis(exp).toISO()));
        return jwt.sign(jwtToken.toJSON(), 'your_jwt_secret');
    }

    public decodeJwtToken(token: string): Nullable<JwtToken> {
        try {
            return <JwtToken> jwt.verify(token, 'your_jwt_secret');
        } catch (JsonWebTokenError) {
            return null;
        }
    }

    public async generateAuthenticatedUser(user: User): Promise<AuthenticatedUser> {
        return new AuthenticatedUser(
            user,
            this.generateJwtToken(user)
        );
    }
}
