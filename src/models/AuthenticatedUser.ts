import {User} from './User';
import {JSONSerializable, JSONSerializableKeys} from './utils/JSONSerializable';

export class AuthenticatedUser implements JSONSerializable<AuthenticatedUser> {
    public static readonly JWT_NAME = 'x-jwt';

    private readonly _user: User;
    private readonly _jwt: string;

    constructor(user: User, jwt: string) {
        this._user = user;
        this._jwt = jwt;
    }

    get user(): User {
        return this._user;
    }

    get jwt(): string {
        return this._jwt;
    }

    public toJSON(): JSONSerializableKeys<AuthenticatedUser> {
        return {
            jwt: this.jwt,
            user: this.user
        };
    }
}
