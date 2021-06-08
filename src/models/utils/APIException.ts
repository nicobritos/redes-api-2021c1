import {Exceptions} from '@models/utils/Exceptions';

export class APIException extends Error {
    public static readonly EVENT_PREFIX = 'API_EXCEPTION_';
    public static readonly GRAPHQL_ERROR_APP_CODE = 'app_codes';

    private readonly _exceptions: Exceptions[];

    public constructor(exceptions: Exceptions[]) {
        super();
        this._exceptions = exceptions;
    }

    public get exceptions(): Exceptions[] {
        return this._exceptions;
    }

    public static formatEventName(exception: Exceptions) {
        return `${APIException.EVENT_PREFIX}${exception.toString()}`;
    }
}
