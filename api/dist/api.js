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
exports.redisClient = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const device_1 = require("./routes/device");
const authorization_1 = require("./routes/authorization");
const dailyAvg_1 = require("./routes/dailyAvg");
const admin_1 = require("./routes/admin");
const redis_1 = require("./utils/redis");
const mongo_1 = require("./utils/mongo");
require("dotenv/config");
const dotenv_1 = require("dotenv");
const authorization_2 = require("./middlewares/authorization");
const seed_1 = require("./seed");
const cors_1 = __importDefault(require("cors"));
// Load the env config
(0, dotenv_1.config)({ path: "../env" });
exports.app = (0, express_1.default)();
exports.app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x_authorization_token");
    next();
});
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use('/device', authorization_2.authorizeMiddleware);
exports.app.use('/admin', authorization_2.authorizeMiddleware);
exports.app.use(device_1.deviceRouter);
exports.app.use(authorization_1.authorizationRouter);
exports.app.use(admin_1.adminRouter);
exports.app.use(dailyAvg_1.aggregateRouter);
exports.redisClient = (0, redis_1.createRedisClient)();
(0, mongo_1.connectToDB)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connected to mongodb. Connecting to redis...");
    try {
        yield exports.redisClient.connect();
        console.log("connected to redis");
    }
    catch (error) {
        console.log(error);
    }
}))
    .catch(err => {
    console.log("error connection", err);
});
// Seed the database with the admin user. This setup is not part of the control flow but for simplciity
// we are calling the seed here
(0, seed_1.seed)();
const port = process.env.PORT || 3000;
exports.app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
