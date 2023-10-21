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
const amqp = __importStar(require("amqplib/callback_api"));
const dotenv_1 = require("dotenv");
require("dotenv/config");
(0, dotenv_1.config)({ path: "../env" });
const connectToRabbitMQ = () => {
    return new Promise((resolve, reject) => {
        console.log("trying to connect");
        let path = process.env.rabbitmq_connect;
        if (path === "" || path === undefined) {
            path = "localhost";
        }
        amqp.connect('amqp://' + path, (err, conn) => {
            if (err) {
                return reject(err);
            }
            return resolve(conn);
        });
    });
};
const runServiceCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield connectToRabbitMQ();
        clearInterval(intervalId);
        connectToChannel(connection);
    }
    catch (error) {
        console.log("Witing for rabbit MQ to start");
    }
});
runServiceCheck();
const intervalId = setInterval(runServiceCheck, 5000);
const connectToChannel = (connection) => {
    console.log("creating connection");
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'data_consumer2';
        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        console.log("auth token", process.env.x_authorization_token);
        channel.consume(queue, (msg) => {
            let apiPort = process.env.api_port;
            let service = process.env.service_name;
            if (process.env.api_port === "" || process.env.api_port === undefined) {
                apiPort = "3000";
                service = "localhost";
            }
            const apiPath = `http://${service}:${apiPort}/save-sensor-data`;
            if (msg) {
                const messageData = JSON.parse(msg.content.toString());
                fetch(apiPath, {
                    body: JSON.stringify({ "data": messageData["data"], "x_authorization_token": process.env.x_authorization_token }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then(res => {
                    return res.json();
                }).then(console.log).catch(err => {
                    console.log(err);
                });
                channel.ack(msg);
            }
        }, {
            // manual acknowledgment mode,
            // see ../confirms.html for details
            noAck: false
        });
    });
};
