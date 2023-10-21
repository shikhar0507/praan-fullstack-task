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
exports.login = void 0;
const models_1 = require("../models/models");
const auth_1 = require("../utils/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const reqBody = {
        email: body["email"],
        password: body["password"]
    };
    if (reqBody.email == "" || reqBody.password == "") {
        res.status(400).json({
            "message": "All fields are required",
            "status": 400
        });
        return;
    }
    // Check if user exists
    const user = yield models_1.UserDataModel.findOne({
        email: reqBody.email
    })
        .select('name roles email password -_id')
        .lean();
    if (!user) {
        res.status(400).json({
            "message": "User doesn't exists",
            "status": 400
        });
        return;
    }
    // Check if the password matches
    const passwordMatch = yield bcrypt_1.default.compare(reqBody.password, user.password);
    if (!passwordMatch) {
        res.status(400).json({
            "message": "Incorrect password",
            "status": 400
        });
        return;
    }
    // Generate JWT Token
    // For the demo puposes only access token is generated here. Ideally a refresh token should also be generated
    const jwtToken = (0, auth_1.createJWTAccessToken)({
        "name": user.name,
        "email": user.email,
        "role": user.roles[0]
    });
    res.status(200).json({
        "message": "Success",
        "status": 200,
        "result": {
            "access_token": jwtToken
        }
    });
});
exports.login = login;
