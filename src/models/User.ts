import {DateTime} from 'luxon';
import {GenericEntity} from './utils/GenericEntity';
import {JSONSerializable, JSONSerializableKeys} from './utils/JSONSerializable';
import {ID, ISODate, Nullable} from './utils/UtilityTypes';
import {XSRFSigner} from '@models/utils/XSRFSigner';

export class AuthUser implements JSONSerializable<AuthUser> {
    private readonly _user: User;
    private readonly _xsrf: string;
    private readonly _validUntil: ISODate;
    private _signedXsrf: string;

    constructor(user: User, xsrf: string, validUntil: ISODate) {
        this._user = user;
        this._xsrf = xsrf;
        this._validUntil = validUntil;
    }

    public get user(): User {
        return this._user;
    }

    public get xsrf(): string {
        return this._xsrf;
    }

    public get validUntil(): ISODate {
        return this._validUntil;
    }

    public get signedXsrf(): string {
        if (!this._signedXsrf) {
            this._signedXsrf = XSRFSigner.sign(this.xsrf);
        }

        return this._signedXsrf;
    }

    public toJSON(): JSONSerializableKeys<AuthUser> {
        return {
            user: this.user,
            xsrf: this.xsrf,
            validUntil: this.validUntil,
        };
    }
}

export class User extends GenericEntity<User> {
    public static readonly VALIDATORS = {
        PASSWORD_REGEX: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~`()_+=\[\]\\'";:/.?><,{}|#!@$%^&*-]).{8,64}$/,
        PASSWORD_MIN_LENGTH: 8,
        PASSWORD_MAX_LENGTH: 64,
        EMAIL_VALIDATOR: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        EMAIL_BEFORE_AT_MAX_LENGTH: 64,
        EMAIL_AFTER_AT_MAX_LENGTH: 255,

        FIRST_NAME_MIN_LENGTH: 2,
        FIRST_NAME_MAX_LENGTH: 40,
        LAST_NAME_MIN_LENGTH: 2,
        LAST_NAME_MAX_LENGTH: 40,
    };

    private _id: ID;
    private _email: string;
    private _password: string;
    private _createdDate: DateTime;
    private _countryId: ID;
    private _regionId: ID;
    private _verified: boolean;
    private _firstName: string;
    private _lastName: string;
    private _verificationToken: Nullable<string>;
    private _isAdmin: boolean;

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

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get createdDate(): DateTime {
        return this._createdDate;
    }

    set createdDate(value: DateTime) {
        this._createdDate = value;
    }

    public get countryId(): ID {
        return this._countryId;
    }

    public set countryId(value: ID) {
        this._countryId = value;
    }

    public get regionId(): ID {
        return this._regionId;
    }

    public set regionId(value: ID) {
        this._regionId = value;
    }

    public get verificationToken(): Nullable<string> {
        return this._verificationToken;
    }

    public set verificationToken(value: Nullable<string>) {
        this._verificationToken = value;
    }

    get verified(): boolean {
        return this._verified;
    }

    set verified(value: boolean) {
        this._verified = value;
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

    public get isAdmin(): boolean {
        return this._isAdmin;
    }

    public set isAdmin(value: boolean) {
        this._isAdmin = value;
    }

    public toJSON(): JSONSerializableKeys<User> {
        return {
            countryId: this.countryId,
            createdDate: this.createdDate,
            email: this.email,
            id: this.id,
            verified: this.verified,
            firstName: this.firstName,
            lastName: this.lastName,
            isAdmin: this.isAdmin
        };
    }
}
