import {User} from './User';
import {JSONSerializable, JSONSerializableKeys} from './utils/JSONSerializable';

export class AuthenticatedUser implements JSONSerializable<AuthenticatedUser> {
    public static readonly JWT_NAME = 'x-jwt';
    public static readonly JWT_ADMIN_NAME = 'x-admin-jwt';
    public static readonly REFRESH_TOKEN_NAME = 'x-refresh-token';
    public static readonly REFRESH_TOKEN_ADMIN_NAME = 'x-admin-refresh-token';
    public static readonly XSRF_HEADER_NAME = 'x-xsrf-token';
    public static readonly XSRF_ADMIN_HEADER_NAME = 'x-admin-xsrf-token';

    private readonly _user: User;
    private readonly _jwt: string;
    private readonly _refreshToken: string;
    private readonly _xsrf: string;

    constructor(user: User, jwt: string, refreshToken: string, xsrf: string) {
        this._user = user;
        this._jwt = jwt;
        this._refreshToken = refreshToken;
        this._xsrf = xsrf;
    }

    get user(): User {
        return this._user;
    }

    get jwt(): string {
        return this._jwt;
    }

    get refreshToken(): string {
        return this._refreshToken;
    }

    public get xsrf(): string {
        return this._xsrf;
    }

    public toJSON(): JSONSerializableKeys<AuthenticatedUser> {
        return {
            jwt: this.jwt,
            refreshToken: this.refreshToken,
            user: this.user,
            xsrf: this.xsrf,
        };
    }
}
