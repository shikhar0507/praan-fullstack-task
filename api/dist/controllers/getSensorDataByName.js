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
exports.getSensorDataByName = void 0;
const models_1 = require("../models/models");
const getSensorDataByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startRange = parseInt(req.query.start);
    const endRange = parseInt(req.query.end);
    const deviceName = req.params.id;
    if (startRange == undefined || endRange == undefined) {
        res.status(400).json({
            "message": "Invalid date range",
            "status": 400
        });
        return;
    }
    try {
        const documents = yield models_1.SensorDataModel.find({ device: deviceName, timestamp: { $lte: endRange, $gte: startRange } })
            .select('device timestamp windSpeed windDirection p1 p25 p10 -_id')
            .lean();
        console.log("found", documents.length, "documents");
        res.status(200).json({
            "message": "Success",
            "status": 200,
            "result": documents
        });
    }
    catch (err) {
        res.status(500).json({
            "message": "Internal server error",
            "status": 500
        });
    }
});
exports.getSensorDataByName = getSensorDataByName;
