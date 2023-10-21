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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const models_1 = require("../models/models");
const config_1 = require("../config/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    const reqBody = {
        name: body["name"],
        email: body["email"],
        password: body["password"]
    };
    if (reqBody.name == "" || reqBody.email == "" || reqBody.password == "") {
        res.status(400).json({
            "message": "All fields are required",
            "status": 400
        });
        return;
    }
    // Check if user already exists
    const user = yield models_1.UserDataModel.findOne({
        email: reqBody.email
    })
        .select('email -_id')
        .lean();
    if (user) {
        res.status(400).json({
            "message": "User already exists",
            "status": 400
        });
        return;
    }
    console.log(reqBody);
    // Hash the password
    let hashedPassword = "";
    try {
        hashedPassword = yield bcrypt_1.default.hash(reqBody.password, 10);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            "message": "Internal server error",
            "status": 500
        });
        return;
    }
    // Create a new user
    const model = new models_1.UserDataModel({
        name: reqBody.name,
        email: reqBody.email,
        password: hashedPassword,
        created_at: Date.now(),
        roles: [config_1.roles.user],
        permissions: [config_1.permissions['read.devices']]
    });
    try {
        yield model.save();
        res.status(200).json({
            "message": "Success",
            "status": 200
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            "message": "Internal server error",
            "status": 500
        });
    }
});
exports.signup = signup;
