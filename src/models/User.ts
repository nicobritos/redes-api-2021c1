import {JSONSerializable, JSONSerializableKeys} from './utils/JSONSerializable';
import {ID, ISODate, Nullable} from './utils/UtilityTypes';
import {GenericEntity} from '@models/utils/GenericEntity';

export class AuthUser implements JSONSerializable<AuthUser> {
    private readonly _user: User;
    private readonly _validUntil: ISODate;

    constructor(user: User, validUntil: ISODate) {
        this._user = user;
        this._validUntil = validUntil;
    }

    public get user(): User {
        return this._user;
    }

    public get validUntil(): ISODate {
        return this._validUntil;
    }

    public toJSON(): JSONSerializableKeys<AuthUser> {
        return {
            user: this.user,
            validUntil: this.validUntil,
        };
    }
}

export class User extends GenericEntity<User> {
    private _id: ID;
    private _email: string;
    private _password: Nullable<string>;
    private _firstName: string;
    private _lastName: string;

    get id(): ID {
        return this._id;
    }

    set id(value: ID) {
        this._id = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): Nullable<string> {
        return this._password;
    }

    set password(value: Nullable<string>) {
        this._password = value;
    }

    public get firstName(): string {
        return this._firstName;
    }

    public set firstName(value: string) {
        this._firstName = value;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public set lastName(value: string) {
        this._lastName = value;
    }

    public toJSON(): JSONSerializableKeys<User> {
        return {
            email: this.email,
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName
        };
    }
}
