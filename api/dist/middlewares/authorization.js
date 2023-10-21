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
exports.authorizeMiddleware = void 0;
const config_1 = require("../config/config");
const auth_1 = require("../utils/auth");
const models_1 = require("../models/models");
const authorizeMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate JWT 
    let token = req.headers[config_1.AuthorizationHeader];
    if (!token) {
        return res.status(400).json({ message: 'Missing authorization header' });
    }
    token = token.replace('Bearer ', '');
    const isValidToken = (0, auth_1.verifyJWT)(token);
    if (!isValidToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Decode the token
    const userData = (0, auth_1.decodeToken)(token);
    console.log(userData);
    if (!userData) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Check for token expiration
    if (!userData.exp) {
        console.log("invalid exp");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (Date.now() > userData.exp * 1000) {
        return res.status(401).json({ message: 'Session Expired' });
    }
    // Check User role
    const user = yield models_1.UserDataModel.findOne({
        email: userData.email
    }).lean();
    console.log(user === null || user === void 0 ? void 0 : user.roles);
    if (userData.role != (user === null || user === void 0 ? void 0 : user.roles[0])) {
        console.log("invalid role");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Check permission
    if (!(user === null || user === void 0 ? void 0 : user.permissions.includes('read.devices'))) {
        console.log("invalid permissions");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Check if protected route was to be accsed by admin. This is just for demo purposes
    if (req.baseUrl === "/admin" && user.roles[0] !== "admin") {
        console.log("invalid admin");
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
});
exports.authorizeMiddleware = authorizeMiddleware;
