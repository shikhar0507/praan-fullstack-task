import {Request, Response} from 'express'
import { UserDataModel } from '../models/models';
export const removeUser = async(req: Request, res: Response) => {


    const body = req.body;
    if(!body["email"]) {
        return res.status(400).json({
            "message": "Empty email field",
            "status":400
        })
        
    }


    const user = await UserDataModel.findOne({
        email: body["email"]
    }).lean()

    if(!user) {
        return res.status(400).json({
            "message": "User not found",
            "status":400
        })
    }
    // remove user if exists
    const deletedUser = await UserDataModel.deleteOne({
        email: body["email"]
    })
    
    if(!deletedUser.deletedCount) {
        return res.status(500).json({
            "message": "Internal server error",
            "status":500
        })
    }
    return res.status(200).json({
        "message": "User deleted successfully",
        "status": 200
    })
    
}