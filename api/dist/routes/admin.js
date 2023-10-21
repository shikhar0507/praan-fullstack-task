"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const userRemove_1 = require("../controllers/userRemove");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.post('/admin/remove', userRemove_1.removeUser);
