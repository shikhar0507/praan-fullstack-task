import {Router, Request, Response } from 'express';
import {saveSensorData} from '../controllers/saveSensorData';
import {getAllSensorData} from '../controllers/getAllSensorData';
import {getSensorDataByName} from '../controllers/getSensorDataByName';
import cors from 'cors';
export const deviceRouter: Router = Router();


/** Save the sensors data */
deviceRouter.post("/save-sensor-data", saveSensorData)

/** Fetch all the sensors data optioanlly filtering by time-range */
deviceRouter.get("/device/get-all",getAllSensorData)

/** Fetch all the data from a particular sensors optioanlly filtering by time-range */
deviceRouter.get("/device/:id",getSensorDataByName)
