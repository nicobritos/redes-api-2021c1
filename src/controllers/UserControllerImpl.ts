import {inject, injectable} from 'inversify';
import {RegistrableController} from './utils/RegisterableController';
import e, {Response, Request} from 'express';
import TYPES from '../types';
import {UserService} from '../interfaces/services/UserService';
import passport from 'passport';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {Unauthorized} from '../exceptions/Unauthorized';
import {UserController} from '../interfaces/controllers/UserController';
import {mainLogger} from '../utils/MainLogger';

@injectable()
export class UserControllerImpl implements UserController {
    @inject(TYPES.Services.UserService)
    private readonly userService: UserService;

    public register(app: e.Application): void {
        app.post('/login', this.login.bind(this));
        app.get('/users', this.isEmailAvailable.bind(this));
    }

    public async isEmailAvailable(req: Request, res: Response): Promise<void> {
        if (!req.query.email || typeof req.query.email !== 'string') {
            res.sendStatus(400);
        }

        res.sendStatus((await this.userService.isEmailAvailable(req.query.email as string)) ? 404 : 200);
    }

    public async login(req: Request, res: Response): Promise<void> {
        passport.authenticate('local', {session: false}, async (err, user: AuthenticatedUser, passportInfo) => {
            let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
            mainLogger.info({
                message: 'login',
                successful: !err && user,
                username: req.body.email,
                ip: ip,
            });

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
