import {RegistrableController} from '../../controllers/utils/RegisterableController';
import {Response, Request} from 'express';

export interface UserController extends RegistrableController {
    login(req: Request, res: Response);
}
