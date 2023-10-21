"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyJWT = exports.createJWTAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWTAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.jwt_secret_key, {
        'expiresIn': '5h',
        algorithm: 'HS256'
    });
};
exports.createJWTAccessToken = createJWTAccessToken;
const verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.jwt_secret_key);
};
exports.verifyJWT = verifyJWT;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeToken = decodeToken;
