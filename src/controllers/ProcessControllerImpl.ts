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
import {ProcessController} from '../interfaces/controllers/ProcessController';

@injectable()
export class ProcessControllerImpl implements ProcessController {
    private static readonly LOGGER = childLogger(__dirname, 'ProcessControllerImpl');

    public register(app: e.Application): void {
        app.post('/process', this.process.bind(this));
    }

    public async process(req: Request, res: Response): Promise<void> {
        let time = randomInt(5000, 15000);

        await sleep(time);

        res.sendStatus(204);
    }
}
