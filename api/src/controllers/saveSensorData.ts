import {Request, Response } from 'express';
import {isValidData, sanitizeData} from '../utils/validate';
import {ISensorData, SensorDataModel} from '../models/models';
import 'dotenv/config'
import { config } from 'dotenv';
import {XAuthorizationHeader} from '../config/config';
import {SensorData} from '../types/device';

export const saveSensorData = async (req: Request, res: Response) => {
    
    // Check if the incoming request has the X-Authorization-Token
    if(req.body[XAuthorizationHeader] != process.env.x_authorization_token) {

        res.status(401).json({
            "message": "Security Token not found",
            "status": 401
        })
        return
    };
    
    // Perform the data validation and sanitzation
    const body = req.body["data"] as SensorData[]
    if(!body.length) {
        res.status(200).json({
            "message":"success",
            "status":200
        })
        return
    }

    const sensorDataArray:ISensorData[] = []

    body.forEach(item=>{
            
        // Validate Data
        if(!isValidData(item)) {
            return
        }
        // Sanitize Data
        const sensorData =  sanitizeData(item)
   

        if(item.timestamp) {
            const data:ISensorData = {
                device:sensorData["device"],
                windDirection: sensorData["wind_direction"],
                windSpeed: sensorData["wind_speed"],
                timestamp: parseInt(sensorData["timestamp"]),
                p1: sensorData["p_1"],
                p10: sensorData["p_10"],
                p25: sensorData["p_25"]
            }
            sensorDataArray.push(data)
        }
    })



    try {   
        await  SensorDataModel.insertMany(sensorDataArray)
        res.status(200).json({
            "message": "Saved data from consumer",
            "status": 200
        })
    }catch(err) {
        res.status(500).json({
            "message": "Error",
            "status": 500
        })
    }
}