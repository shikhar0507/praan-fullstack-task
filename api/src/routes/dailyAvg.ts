import {Router, Request, Response } from 'express';

import {getDailyAverage} from '../controllers/getDailyAverage';
export const aggregateRouter: Router = Router();

/** Fetch the daily averages */
aggregateRouter.get("/daily-average",getDailyAverage)
