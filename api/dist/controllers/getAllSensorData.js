"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSensorData = void 0;
const models_1 = require("../models/models");
const getAllSensorData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startRange = parseInt(req.query.start);
    const endRange = parseInt(req.query.end);
    if (Number.isNaN(startRange) || Number.isNaN(endRange)) {
        res.status(400).json({
            "message": "Invalid date range",
            "status": 400
        });
        return;
    }
    // First find it within redis , if found then return from redis else fetch from the database
    // const redisClient = app.get('redisClient') as RedisClientType
    const inputCacheKey = endRange - startRange;
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
        const documents = yield models_1.SensorDataModel.find({ timestamp: { $lte: endRange, $gte: startRange } })
            .select('device timestamp windSpeed windDirection p1 p25 p10 -_id')
            .sort({ timestamp: 1 })
            .lean();
        // save it to redis cache
        // try {
        //     await redisClient.set(cacheKey,JSON.stringify(documents))
        // }catch(err) {
        //     console.error('error caching data to Redis:', err);
        // }
        res.status(200).json({
            "message": "Success",
            "status": 200,
            "result": documents
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            "message": "Internal server error",
            "status": 500
        });
    }
});
exports.getAllSensorData = getAllSensorData;
