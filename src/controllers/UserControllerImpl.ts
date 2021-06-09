import {inject, injectable} from 'inversify';
import {RegistrableController} from './utils/RegisterableController';
import e, {Response, Request} from 'express';
import TYPES from '../types';
import {UserService} from '../interfaces/services/UserService';
import passport from 'passport';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {Unauthorized} from '../exceptions/Unauthorized';

@injectable()
export class UserControllerImpl implements RegistrableController {
    @inject(TYPES.Services.UserService)
    private readonly userService: UserService;

    public register(app: e.Application): void {
        app.post('/login', this.login);
    }

    public async login(req: Request, res: Response) {
        passport.authenticate('local', {session: false}, async (err, user: AuthenticatedUser, passportInfo) => {
            if (!err && !user) {
                return res.sendStatus(401);
            } else if (err instanceof Unauthorized || !user) {
                return res.sendStatus(401);
            } else if (err instanceof Error) {
                return res.sendStatus(500);
            }

            res.status(200);
            return res.send(user);
        })(req, res);
    }
}
