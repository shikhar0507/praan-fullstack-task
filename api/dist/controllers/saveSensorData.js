"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSensorData = void 0;
const validate_1 = require("../utils/validate");
const models_1 = require("../models/models");
require("dotenv/config");
const config_1 = require("../config/config");
const saveSensorData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the incoming request has the X-Authorization-Token
    if (req.body[config_1.XAuthorizationHeader] != process.env.x_authorization_token) {
        res.status(401).json({
            "message": "Security Token not found",
            "status": 401
        });
        return;
    }
    ;
    // Perform the data validation and sanitzation
    const body = req.body["data"];
    if (!body.length) {
        res.status(200).json({
            "message": "success",
            "status": 200
        });
        return;
    }
    const sensorDataArray = [];
    body.forEach(item => {
        // Validate Data
        if (!(0, validate_1.isValidData)(item)) {
            return;
        }
        // Sanitize Data
        const sensorData = (0, validate_1.sanitizeData)(item);
        if (item.timestamp) {
            const data = {
                device: sensorData["device"],
                windDirection: sensorData["wind_direction"],
                windSpeed: sensorData["wind_speed"],
                timestamp: parseInt(sensorData["timestamp"]),
                p1: sensorData["p_1"],
                p10: sensorData["p_10"],
                p25: sensorData["p_25"]
            };
            sensorDataArray.push(data);
        }
    });
    try {
        yield models_1.SensorDataModel.insertMany(sensorDataArray);
        res.status(200).json({
            "message": "Saved data from consumer",
            "status": 200
        });
    }
    catch (err) {
        res.status(500).json({
            "message": "Error",
            "status": 500
        });
    }
});
exports.saveSensorData = saveSensorData;
