import express, { NextFunction, Request, Response } from 'express';
import { deviceRouter } from './routes/device';
import {authorizationRouter} from './routes/authorization';
import {aggregateRouter} from './routes/dailyAvg';
import {adminRouter} from './routes/admin';
import { connectToRedis, createRedisClient } from './utils/redis';
import {connectToDB} from './utils/mongo';
import 'dotenv/config'
import { config } from 'dotenv';
import { authorizeMiddleware } from './middlewares/authorization';
import {seed} from './seed';
import cors from 'cors';
import RedisClient from '@redis/client/dist/lib/client';
import { RedisClientType, RedisDefaultModules } from 'redis';

// Load the env config
config({path:"../env"})
export const app = express();

app.all("*",function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x_authorization_token");
    next();
});
app.use(cors())

app.use(express.json({limit: '50mb'}));
app.use('/device',authorizeMiddleware)
app.use('/admin',authorizeMiddleware)
app.use(deviceRouter);
app.use(authorizationRouter)
app.use(adminRouter)
app.use(aggregateRouter)

export let redisClient =  createRedisClient()


connectToDB().then(async ()=>{
    console.log("connected to mongodb. Connecting to redis...")
    try {
        await redisClient.connect()
        console.log("connected to redis");
    } catch (error) {
        console.log(error)
    }
})

.catch(err=>{
    console.log("error connection", err)
})

// Seed the database with the admin user. This setup is not part of the control flow but for simplciity
// we are calling the seed here

seed()

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})

