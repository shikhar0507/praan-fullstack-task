"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationRouter = void 0;
const express_1 = require("express");
const signup_1 = require("../controllers/signup");
const login_1 = require("../controllers/login");
exports.authorizationRouter = (0, express_1.Router)();
exports.authorizationRouter.post("/user/signup", signup_1.signup);
exports.authorizationRouter.post("/user/login", login_1.login);
