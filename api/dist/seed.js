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
exports.seed = void 0;
/** This file seeds the database with rules and permission  */
const mongodb_1 = require("mongodb");
const allRoles = ['user', 'admin'];
const permissions = ['read.devices', 'remove.users'];
const seedDatabaseWithRules = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        name: 'admin',
        email: 'random',
        created_at: Date.now(),
        password: 'admin123',
        roles: [allRoles[1]],
        permissions: permissions
    };
    yield db.collection('users').insertOne(data);
});
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/praan');
    try {
        const db = client.db('praan');
        yield db.collection('users').deleteOne({
            roles: ['admin']
        });
        yield seedDatabaseWithRules(db);
        console.log("DB seeded");
    }
    catch (error) {
        console.error(error);
    }
    finally {
        yield client.close();
    }
});
exports.seed = seed;
