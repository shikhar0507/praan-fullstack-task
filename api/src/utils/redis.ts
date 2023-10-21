import crypto from 'crypto';
import * as redis from 'redis';

export const createRedisClient = () => {
   
    const client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    client.on('error',(err: Error)=>{
        throw err
    })
    return client

}

export const connectToRedis = async (client:redis.RedisClientType) => {
    try {
        await client.connect()
    } catch (error) {
        console.log(error)
    }
}

export const generateRedisKey = (input: string) => {
    return crypto.createHash('sha256').update(input).digest('hex');
}
