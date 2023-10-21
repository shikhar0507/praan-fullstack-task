import {Request, Response , NextFunction} from 'express';
import { AuthorizationHeader, roles } from '../config/config';
import { verifyJWT,decodeToken } from '../utils/auth';
import { UserDataModel } from '../models/models';
import { JwtPayload } from 'jsonwebtoken';



export  const authorizeMiddleware = async (req: Request ,res: Response,next: NextFunction) => {

    // Validate JWT 
    let token = req.headers[AuthorizationHeader] as string;
    if(!token) {
        return res.status(400).json({ message: 'Missing authorization header' });
    }

    token = token.replace('Bearer ','');
    const isValidToken = verifyJWT(token)
    if(!isValidToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Decode the token
    const userData = decodeToken(token) as JwtPayload
    console.log(userData)
    if (!userData) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Check for token expiration
    if(!userData.exp) {
        console.log("invalid exp")

        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(Date.now() > userData.exp*1000) {
        return res.status(401).json({ message: 'Session Expired' });

    }

    // Check User role
    const user = await UserDataModel.findOne({
        email: userData.email
    }).lean()
    console.log(user?.roles)
    if(userData.role != user?.roles[0]) {
        console.log("invalid role")

        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check permission
    if(!user?.permissions.includes('read.devices')) {
        console.log("invalid permissions")

        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if protected route was to be accsed by admin. This is just for demo purposes
    if(req.baseUrl === "/admin" && user.roles[0] !== "admin") {
        console.log("invalid admin")

        return res.status(401).json({ message: 'Unauthorized access' });

    }
    next()
};


