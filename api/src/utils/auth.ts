
import jwt from 'jsonwebtoken';
import { User } from '../types/user';


export const createJWTAccessToken = (payload:Object): string => {
    return jwt.sign(payload,process.env.jwt_secret_key as string,{
        'expiresIn' : '5h',
        algorithm:'HS256'
    })
}

export const verifyJWT = (token: string) => {
    return jwt.verify(token,process.env.jwt_secret_key as string)
}

export const decodeToken = (token:string) => {
    return jwt.decode(token)
}