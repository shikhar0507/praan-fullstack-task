"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataModel = exports.SensorDataModel = exports.DailyAveragesModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.DailyAveragesModel = mongoose_1.default.model('DailyAverages', new mongoose_1.Schema({
    date: {
        type: String,
        required: true,
    },
    p1: {
        type: Number,
        required: true
    },
    p25: {
        type: Number,
        required: true
    },
    p10: {
        type: Number,
        required: true
    }
}));
exports.SensorDataModel = (0, mongoose_1.model)('devices', new mongoose_1.Schema({
    device: {
        type: String,
        required: true
    },
    windDirection: {
        type: String,
        required: true
    },
    windSpeed: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true,
        index: true
    },
    p1: {
        type: Number,
        required: true
    },
    p25: {
        type: Number,
        required: true
    },
    p10: {
        type: Number,
        required: true
    }
}));
exports.UserDataModel = mongoose_1.default.model('users', new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: Date,
    email: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
    },
    permissions: {
        type: [String],
        required: true
    }
}));
