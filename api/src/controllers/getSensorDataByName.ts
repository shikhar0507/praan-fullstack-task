import {Request, Response} from 'express'
import {SensorDataModel} from '../models/models';
export const getSensorDataByName = async(req: Request, res: Response) => {

    const startRange = parseInt(req.query.start as string);
    const endRange = parseInt(req.query.end as string);
    const deviceName = req.params.id
    if(startRange == undefined|| endRange == undefined) {
        res.status(400).json({
            "message":"Invalid date range",
            "status":400
        })
        return
    }

    try {
        const documents = await SensorDataModel.find({device:deviceName,timestamp: {$lte: endRange, $gte:startRange}})
        .select('device timestamp windSpeed windDirection p1 p25 p10 -_id')
        .lean()
        console.log("found", documents.length , "documents")
        res.status(200).json({
            "message":"Success",
            "status":200,
            "result" : documents
            
        })
    }catch(err) {
        res.status(500).json({
            "message":"Internal server error",
            "status":500
        })
    }
 
}