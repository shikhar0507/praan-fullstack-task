

import {Request, Response} from 'express'
import {DailyAveragesModel} from '../models/models';
export const getDailyAverage = async (req:Request, res:Response) => {
    
    const startRange = req.query.start as string;
    const endRange = req.query.end as string;
    if(Number.isNaN(startRange) || Number.isNaN(endRange)) {
        res.status(400).json({
            "message":"Invalid date range",
            "status":400
        })
        return
    }

    const documents = await DailyAveragesModel.find({
        date: {$gte:startRange,$lte:endRange},
        
    }).sort({date: 1})
    
    
    res.status(200).json({
        "message": "success",
        "status": 200,
        "result": documents
    })
}