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
import {assertStringID} from '@models/utils/Utils';
import {childLogger, mainLogger} from '../utils/MainLogger';
import container from '../inversify.config';

@injectable()
export class PostControllerImpl implements PostController {
    private static readonly LOGGER = childLogger(__dirname, 'PostControllerImpl');

    @inject(TYPES.Services.PostService)
    private readonly service: PostService;

    public register(app: e.Application): void {
        app.get('/posts', this.findAll.bind(this));
        app.get('/posts/:id', this.findById.bind(this));
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        if (Object.keys(req.query).length > 0) {
            res.sendStatus(400);
        }

        res.status(200).send(await this.service.findAll());
    }

    public async findById(req: Request, res: Response): Promise<void> {
        if (Object.keys(req.query).length > 0) {
            PostControllerImpl.LOGGER.info({
                url: req.url,
                status: 400,
                reason: 'Invalid query'
            });
            res.sendStatus(400);
        }

        try {
            assertStringID(req.params.id);
        } catch (e) {
            PostControllerImpl.LOGGER.error({
                url: req.url,
                status: 400,
                reason: JSON.stringify(e)
            });

            res.sendStatus(400);
        }

        let post = await this.service.findById(req.params.id);
        if (!!post) {
            PostControllerImpl.LOGGER.info({
                url: req.url,
                status: 200,
                reason: ''
            });

            res.status(200).send(post);
        } else {
            PostControllerImpl.LOGGER.info({
                url: req.url,
                status: 404,
                reason: 'Post not found'
            });

            res.sendStatus(404);
        }
    }
}
