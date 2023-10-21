import {Router} from 'express';
import {removeUser} from '../controllers/userRemove';
import {Request,Response} from 'express';

export const adminRouter: Router = Router()
adminRouter.post('/admin/remove',removeUser)
