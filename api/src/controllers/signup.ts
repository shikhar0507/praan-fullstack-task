import {Request, Response} from 'express';
import { requestBodySignup } from '../types/user';
import { UserDataModel } from '../models/models';
import { roles,permissions } from '../config/config';
import bcrypt from 'bcrypt';

export const signup = async (req: Request, res: Response) => {

    const body = req.body;
    console.log(body)
    const reqBody:requestBodySignup = {
        name: body["name"],
        email: body["email"],
        password: body["password"]
    }
    
    if (reqBody.name == "" || reqBody.email == "" || reqBody.password == "") {
        res.status(400).json({
            "message": "All fields are required",
            "status": 400
        })
        return
    }

    // Check if user already exists
    
    const user = await UserDataModel.findOne({
        email: reqBody.email
    })
    .select('email -_id')
    .lean()

    if(user) {
        res.status(400).json({
            "message": "User already exists",
            "status": 400
        })

        return
    }
console.log(reqBody)
    // Hash the password
    let hashedPassword = "";
    try {
        hashedPassword = await bcrypt.hash(reqBody.password,10)
    } catch(err) {
        console.error(err)
        res.status(500).json({
            "message": "Internal server error",
            "status": 500
        })
        return
    }

    
    // Create a new user
    const model = new UserDataModel({
        name: reqBody.name,
        email: reqBody.email,
        password: hashedPassword,
        created_at: Date.now(),
        roles: [roles.user],
        permissions:[permissions['read.devices']]
    })
    try {
        await model.save()
        res.status(200).json({
            "message": "Success",
            "status": 200
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({
            "message": "Internal server error",
            "status": 500
        })
    }
  
}