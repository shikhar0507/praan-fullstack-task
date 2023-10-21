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
exports.getDailyAverage = void 0;
const models_1 = require("../models/models");
const getDailyAverage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startRange = req.query.start;
    const endRange = req.query.end;
    if (Number.isNaN(startRange) || Number.isNaN(endRange)) {
        res.status(400).json({
            "message": "Invalid date range",
            "status": 400
        });
        return;
    }
    const documents = yield models_1.DailyAveragesModel.find({
        date: { $gte: startRange, $lte: endRange },
    }).sort({ date: 1 });
    res.status(200).json({
        "message": "success",
        "status": 200,
        "result": documents
    });
});
exports.getDailyAverage = getDailyAverage;
