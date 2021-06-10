import {inject, injectable} from 'inversify';
import {RegistrableController} from './utils/RegisterableController';
import e, {Response, Request} from 'express';
import TYPES from '../types';
import {UserService} from '../interfaces/services/UserService';
import passport from 'passport';
import {AuthenticatedUser} from '@models/AuthenticatedUser';
import {Unauthorized} from '../exceptions/Unauthorized';
import {PostController} from '../interfaces/controllers/PostController';
import {PostService} from '../interfaces/services/PostService';
import {Post} from '@models/Post';
import {assertStringID, sleep} from '@models/utils/Utils';
import {childLogger, mainLogger} from '../utils/MainLogger';
import {randomInt} from 'crypto';

@injectable()
export class ProcessControllerImpl implements RegistrableController {
    private static readonly LOGGER = childLogger(__dirname, 'PostControllerImpl');

    public register(app: e.Application): void {
        app.get('/process', this.process);
    }

    public async process(req: Request, res: Response): Promise<void> {
        await sleep(randomInt(5000, 10000));
        res.sendStatus(204);
    }
}
