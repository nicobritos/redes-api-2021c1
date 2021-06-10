import {RegistrableController} from '../../controllers/utils/RegisterableController';
import {Response, Request} from 'express';
import {ID, Nullable} from '@models/utils/UtilityTypes';
import {Post} from '@models/Post';

export interface PostController extends RegistrableController {
    findById(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
}
