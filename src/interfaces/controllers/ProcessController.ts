import {RegistrableController} from '../../controllers/utils/RegisterableController';
import {Response, Request} from 'express';
import {ID, Nullable} from '@models/utils/UtilityTypes';
import {Post} from '@models/Post';

export interface ProcessController extends RegistrableController {
    process(req: Request, res: Response): Promise<void>;
}
