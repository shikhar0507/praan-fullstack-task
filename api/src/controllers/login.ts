import {Request, Response} from 'express';
import { requestBodyLogin } from '../types/user';
import { UserDataModel } from '../models/models';
import { roles,permissions } from '../config/config';
import {createJWTAccessToken} from '../utils/auth';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {

    const body = req.body;
    const reqBody:requestBodyLogin = {
        email: body["email"],
        password: body["password"]
    }
    
    if (reqBody.email == "" || reqBody.password == "") {
        res.status(400).json({
            "message": "All fields are required",
            "status": 400
        })
        return
    }


    // Check if user exists
    const user = await UserDataModel.findOne({
        email: reqBody.email
    })
    .select('name roles email password -_id')
    .lean()

    if(!user) {
        res.status(400).json({
            "message": "User doesn't exists",
            "status": 400
        })

        return
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(reqBody.password,user.password)
    if (!passwordMatch) {
        res.status(400).json({
            "message": "Incorrect password",
            "status": 400
        })
        return
    }

    // Generate JWT Token
    // For the demo puposes only access token is generated here. Ideally a refresh token should also be generated
    const jwtToken = createJWTAccessToken({
        "name": user.name,
        "email": user.email,
        "role": user.roles[0]
    })
    
  
    res.status(200).json({
        "message": "Success",
        "status": 200,
        "result": {
            "access_token": jwtToken
        }
    })
}