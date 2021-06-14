import {inject, injectable} from 'inversify';
import {RegistrableController} from './utils/RegisterableController';
import e, {Response, Request} from 'express';
import TYPES from '../types';
import {UserService} from '../interfaces/services/UserService';
import passport from 'passport';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {Unauthorized} from '../exceptions/Unauthorized';
import {UserController} from '../interfaces/controllers/UserController';
import {childLogger, mainLogger} from '../utils/MainLogger';

@injectable()
export class UserControllerImpl implements UserController {
    private static readonly LOGGER = childLogger(__dirname, 'UserControllerImpl');

    @inject(TYPES.Services.UserService)
    private readonly userService: UserService;

    public register(app: e.Application): void {
        app.post('/login', this.login.bind(this));
        app.get('/users', this.isEmailAvailable.bind(this));
    }

    public async isEmailAvailable(req: Request, res: Response): Promise<void> {
        if (!req.query.email || typeof req.query.email !== 'string') {
            UserControllerImpl.LOGGER.info({
                url: req.url,
                status: 400,
                reason: `Invalid query`,
            });

            res.sendStatus(400);
        } else {
            let status = (await this.userService.isEmailAvailable(req.query.email as string)) ? 404 : 200;

            UserControllerImpl.LOGGER.info({
                url: req.url,
                status: status,
                reason: status === 200 ? '' : 'Not available',
            });

            res.sendStatus(status);
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        passport.authenticate('local', {session: false}, async (err, user: AuthenticatedUser, passportInfo) => {
            let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
            let status = 0;

            if (!err && !user) {
                status = 401;
            } else if (err instanceof Unauthorized || !user) {
                status = 401;
            } else if (err instanceof Error) {
                status = 500;
            }

            UserControllerImpl.LOGGER.info({
                url: req.url,
                status: status || 200,
                reason: `Login`,
                successful: !err && user,
                username: req.body.email,
                ip: ip,
            });
            console.log("wtf this is not working");

            if (status > 0) {
                res.sendStatus(status);
            } else {
                res.status(200);
                res.send(user);
            }
        })(req, res);
    }
}
