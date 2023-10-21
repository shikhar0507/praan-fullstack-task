"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRouter = void 0;
const express_1 = require("express");
const saveSensorData_1 = require("../controllers/saveSensorData");
const getAllSensorData_1 = require("../controllers/getAllSensorData");
const getSensorDataByName_1 = require("../controllers/getSensorDataByName");
exports.deviceRouter = (0, express_1.Router)();
/** Save the sensors data */
exports.deviceRouter.post("/save-sensor-data", saveSensorData_1.saveSensorData);
/** Fetch all the sensors data optioanlly filtering by time-range */
exports.deviceRouter.get("/device/get-all", getAllSensorData_1.getAllSensorData);
/** Fetch all the data from a particular sensors optioanlly filtering by time-range */
exports.deviceRouter.get("/device/:id", getSensorDataByName_1.getSensorDataByName);
