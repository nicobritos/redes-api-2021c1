import * as express from 'express';
import {AuthService} from '../interfaces/services/AuthService';
import container from '../../inversify.config';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {User} from '@models/User';
import {AuthServiceImpl} from '../services/AuthServiceImpl';
import TYPES from '../../types';
import {JwtToken} from '@models/JwtToken';
import {DateTime} from 'luxon';

export default class AuthenticationUtils {
    public static forceRefreshToken(res: express.Response, isAdmin: boolean): void {
        let cookiesOptions = this.getCookiesOptions();
        res.clearCookie(isAdmin ? AuthenticatedUser.JWT_ADMIN_NAME : AuthenticatedUser.JWT_NAME, cookiesOptions);
    }

    public static clearCookies(res: express.Response, isAdmin: boolean): void {
        let cookiesOptions = this.getCookiesOptions();
        if (isAdmin) {
            res.clearCookie(AuthenticatedUser.JWT_ADMIN_NAME, cookiesOptions);
            res.clearCookie(AuthenticatedUser.REFRESH_TOKEN_ADMIN_NAME, cookiesOptions);
        } else {
            res.clearCookie(AuthenticatedUser.JWT_NAME, cookiesOptions);
            res.clearCookie(AuthenticatedUser.REFRESH_TOKEN_NAME, cookiesOptions);
        }
    }

    public static setAuthenticationData(user: AuthenticatedUser, res: express.Response): DateTime {
        let validUntil = DateTime.local().plus({ milliseconds: AuthServiceImpl.JWT_EXPIRATION_MILLIS });

        let jwtCookies = this.getCookiesOptions();
        jwtCookies.maxAge = AuthServiceImpl.JWT_EXPIRATION_MILLIS;
        res.cookie(user.user.isAdmin ? AuthenticatedUser.JWT_ADMIN_NAME : AuthenticatedUser.JWT_NAME, user.jwt, jwtCookies);

        let refreshTokenCookies = this.getCookiesOptions();
        refreshTokenCookies.maxAge = AuthServiceImpl.REFRESH_TOKEN_EXPIRATION_MILLIS;
        res.cookie(user.user.isAdmin ? AuthenticatedUser.REFRESH_TOKEN_ADMIN_NAME : AuthenticatedUser.REFRESH_TOKEN_NAME, user.refreshToken, refreshTokenCookies);

        return validUntil;
    }

    public static getUserFromRequest(req: express.Request, res: express.Response, checkXsrf: boolean, isAdmin: boolean): User {
        if (!req.cookies) return null;
        let jwt = req.cookies[isAdmin ? AuthenticatedUser.JWT_ADMIN_NAME : AuthenticatedUser.JWT_NAME];
        if (!jwt) return null;

        let jwtToken = (container.get(TYPES.Services.AuthService) as AuthService).decodeJwtToken(jwt);
        if (!jwtToken || jwtToken.payload.user.isAdmin !== isAdmin) {
            this.clearCookies(res, isAdmin);
            return null;
        }
        if (checkXsrf && !this.validateXsrf(jwtToken, req)) {
            // We need to invalidate the JWT to avoid malicious client trying to perform more requests
            // But we also need to consider the case in which the JWT was sent to the server but it has
            // already expired, so we force the client to have to refresh the token
            this.forceRefreshToken(res, isAdmin);
            return null;
        }

        let user = jwtToken.payload.user;

        user.id = jwtToken.sub;
        user.createdDate = DateTime.fromISO(user.createdDate as unknown as string);

        return user;
    }

    public static getRefreshTokenFromRequest(req: express.Request, isAdmin: boolean): string {
        if (!req.cookies) return null;
        return req.cookies[isAdmin ? AuthenticatedUser.REFRESH_TOKEN_ADMIN_NAME : AuthenticatedUser.REFRESH_TOKEN_NAME];
    }

    private static validateXsrf(jwt: JwtToken, req: express.Request): boolean {
        if (!req.header(AuthenticatedUser.XSRF_HEADER_NAME)) return false;
        return jwt.payload.xsrf === jwt.payload.signedXsrf;
    }

    private static getCookiesOptions(): express.CookieOptions {
        return {
            domain: '.latinbox.com',
            httpOnly: true,
            // Todo set to lax,
            path: '/', 
            sameSite: 'lax'
            // SameSite: true,
            // Signed: true,
            // Secure: true
        };
    }
}
