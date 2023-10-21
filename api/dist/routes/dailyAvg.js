"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateRouter = void 0;
const express_1 = require("express");
const getDailyAverage_1 = require("../controllers/getDailyAverage");
exports.aggregateRouter = (0, express_1.Router)();
/** Fetch the daily averages */
exports.aggregateRouter.get("/daily-average", getDailyAverage_1.getDailyAverage);
