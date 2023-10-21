"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = exports.roles = exports.AuthorizationHeader = exports.sensorTimestampFormat = exports.XAuthorizationHeader = void 0;
exports.XAuthorizationHeader = "x_authorization_token";
exports.sensorTimestampFormat = "yy/mm/dd,HH:mm:ss";
exports.AuthorizationHeader = "authorization";
exports.roles = {
    'user': 'user',
    'admin': 'admin'
};
exports.permissions = {
    'read.devices': 'read.devices',
    'remove.users': 'remove.users'
};
