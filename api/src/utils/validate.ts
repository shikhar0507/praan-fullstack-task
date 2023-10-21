/** Sanitize remove the empty or ill-formatted sensosr data */
import {SensorData} from '../types/device';
const { DateTime } = require('luxon');
import {sensorTimestampFormat} from '../config/config';
// isValidData - Performs the following checks
// 1. Check if any key-value pair is empty
// 2. Check if timestamp format is correct 
// 3. Check for logical assertions where
//  3.1 windDirection can only be a subset of defined types
//  3.2 windSpeed can only be a subset of defined types
export const isValidData = (data: SensorData): Boolean => {
    const allowedWindDirection:{[key:string]: Boolean} = {
        'N': true,
        'S': true,
        'E': true,
        'W': true,
        'NE': true,
        'NW': true,
        'SE': true,
        'SW': true,
        'NNE': true,
        'NNW': true,
        'SSE': true,
        'SSW': true,
        'ENE': true,
        'ESE': true,
        'WNW': true,
        'WSW': true,
      };

    // Check if any field is empty 
    let hasEmptyField = false
    Object.keys(data).forEach((key) => {
        
        if (data[key as keyof SensorData] === null || data[key as keyof SensorData] === "") {
             hasEmptyField =  true;
             return
        }
    });

    if (hasEmptyField) {
        return false
    }


    if(!isDateInFormat(data.timestamp)) {
        return false;
    }

    const parsedDate = parseDate(data.timestamp)



    if(!parsedDate.isValid) {
        return false
    }

    if (data.wind_speed < 0) {
        return false
    }

    if(allowedWindDirection[data.wind_direction]) return true

    return false

}

const isDateInFormat = (timeStamp: string): Boolean => {
    try {
        const parsedDate = DateTime.fromFormat(timeStamp,sensorTimestampFormat)
        return parsedDate.isValid
    }  catch(err) {
        return false;
    }
}

const parseDate = (timestamp: string) => {


    const [date,time] = timestamp.split(",");
    const dateSplit= date.split("/")
    const timeSplit = time.split(":")
   
    const modDate = DateTime.fromObject({
        day: dateSplit[2],
        month: dateSplit[1],
        year: 20+dateSplit[0],
        hour: timeSplit[0],
        minute: timeSplit[1],
        second: timeSplit[2]
    })
    return modDate
}

export const sanitizeData = (data: SensorData) : SensorData => {

    const parsedDate = parseDate(data.timestamp)
    data.timestamp = parsedDate.toMillis()
    
    return data
}