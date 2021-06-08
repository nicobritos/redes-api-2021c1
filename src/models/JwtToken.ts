import {JSONSerializable, JSONSerializableKeys} from './utils/JSONSerializable';
import {ID} from './utils/UtilityTypes';
import {AuthUser} from '@models/User';

export class JwtToken implements JSONSerializable<JwtToken> {
    private readonly _iat: number;
    private readonly _exp: number;
    private readonly _sub: ID;
    private readonly _payload: AuthUser;

    constructor(iat: number, exp: number, sub: ID, payload: AuthUser) {
        this._iat = iat;
        this._exp = exp;
        this._sub = sub;
        this._payload = payload;
    }

    get iat(): number {
        return this._iat;
    }

    get exp(): number {
        return this._exp;
    }

    get sub(): ID {
        return this._sub;
    }

    public get payload(): AuthUser {
        return this._payload;
    }

    public toJSON(): JSONSerializableKeys<JwtToken> {
        return {
            exp: this.exp,
            iat: this.iat,
            sub: this.sub,
            payload: this.payload
        };
    }
}
