import {Request, Response} from 'express'
import {SensorDataModel} from '../models/models';
import Redis, { RedisClientType } from 'redis';
import {app} from '../api'
import {generateRedisKey} from '../utils/redis';
import {redisClient} from '../api';
export const getAllSensorData = async(req: Request, res: Response) => {
    const startRange = parseInt(req.query.start as string);
    const endRange = parseInt(req.query.end as string);
    if(Number.isNaN(startRange) || Number.isNaN(endRange)) {
        res.status(400).json({
            "message":"Invalid date range",
            "status":400
        })
        return
    }

    // First find it within redis , if found then return from redis else fetch from the database

    // const redisClient = app.get('redisClient') as RedisClientType

    const inputCacheKey = endRange-startRange

    // const cacheKey = generateRedisKey(String(inputCacheKey))
    // try {
    //     const cachedData = await redisClient.get(cacheKey)
    //     if (cachedData) {
    //         console.log("found in redis cache")
    //         res.status(200).json({
    //             "message":"Success",
    //             "status":200,
    //             "result" : JSON.parse(cachedData)
    //         })
    //         return
    //     }
    // } catch(err) {
    //     console.log(err)
    // }
   

    try {
        const documents = await SensorDataModel.find({timestamp: {$lte: endRange, $gte:startRange}})
        .select('device timestamp windSpeed windDirection p1 p25 p10 -_id')
        .sort({timestamp: 1})
        .lean()

        // save it to redis cache
        // try {
        //     await redisClient.set(cacheKey,JSON.stringify(documents))
        // }catch(err) {
        //     console.error('error caching data to Redis:', err);
        // }

        res.status(200).json({
            "message":"Success",
            "status":200,
            "result" : documents
            
        })
    }catch(err) {
        console.error(err)
        res.status(500).json({
            "message":"Internal server error",
            "status":500
        })
    }
    
}