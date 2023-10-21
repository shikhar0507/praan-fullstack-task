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
exports.removeUser = void 0;
const models_1 = require("../models/models");
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body["email"]) {
        return res.status(400).json({
            "message": "Empty email field",
            "status": 400
        });
    }
    const user = yield models_1.UserDataModel.findOne({
        email: body["email"]
    }).lean();
    if (!user) {
        return res.status(400).json({
            "message": "User not found",
            "status": 400
        });
    }
    // remove user if exists
    const deletedUser = yield models_1.UserDataModel.deleteOne({
        email: body["email"]
    });
    if (!deletedUser.deletedCount) {
        return res.status(500).json({
            "message": "Internal server error",
            "status": 500
        });
    }
    return res.status(200).json({
        "message": "User deleted successfully",
        "status": 200
    });
});
exports.removeUser = removeUser;
