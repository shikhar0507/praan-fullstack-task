"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeData = exports.isValidData = void 0;
const { DateTime } = require('luxon');
const config_1 = require("../config/config");
// isValidData - Performs the following checks
// 1. Check if any key-value pair is empty
// 2. Check if timestamp format is correct 
// 3. Check for logical assertions where
//  3.1 windDirection can only be a subset of defined types
//  3.2 windSpeed can only be a subset of defined types
const isValidData = (data) => {
    const allowedWindDirection = {
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
    let hasEmptyField = false;
    Object.keys(data).forEach((key) => {
        if (data[key] === null || data[key] === "") {
            hasEmptyField = true;
            return;
        }
    });
    if (hasEmptyField) {
        return false;
    }
    if (!isDateInFormat(data.timestamp)) {
        return false;
    }
    const parsedDate = parseDate(data.timestamp);
    if (!parsedDate.isValid) {
        return false;
    }
    if (data.wind_speed < 0) {
        return false;
    }
    if (allowedWindDirection[data.wind_direction])
        return true;
    return false;
};
exports.isValidData = isValidData;
const isDateInFormat = (timeStamp) => {
    try {
        const parsedDate = DateTime.fromFormat(timeStamp, config_1.sensorTimestampFormat);
        return parsedDate.isValid;
    }
    catch (err) {
        return false;
    }
};
const parseDate = (timestamp) => {
    const [date, time] = timestamp.split(",");
    const dateSplit = date.split("/");
    const timeSplit = time.split(":");
    const modDate = DateTime.fromObject({
        day: dateSplit[2],
        month: dateSplit[1],
        year: 20 + dateSplit[0],
        hour: timeSplit[0],
        minute: timeSplit[1],
        second: timeSplit[2]
    });
    return modDate;
};
const sanitizeData = (data) => {
    const parsedDate = parseDate(data.timestamp);
    data.timestamp = parsedDate.toMillis();
    return data;
};
exports.sanitizeData = sanitizeData;
