import {injectable} from 'inversify';
import {RegistrableController} from './utils/RegisterableController';
import e from 'express';

@injectable()
export class UserControllerImpl implements RegistrableController {
    public register(app: e.Application): void {
    }
}
