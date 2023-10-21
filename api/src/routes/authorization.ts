import {Router} from 'express';
import {signup} from '../controllers/signup';
import {login} from '../controllers/login';

export const authorizationRouter: Router = Router()

authorizationRouter.post("/user/signup",signup)

authorizationRouter.post("/user/login",login)
