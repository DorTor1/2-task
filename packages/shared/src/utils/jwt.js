"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const signJwt = (payload) => {
    const config = (0, config_1.getConfig)();
    const options = {
        expiresIn: config.jwtExpiresIn,
        issuer: 'task-platform',
    };
    return jsonwebtoken_1.default.sign(payload, config.jwtSecret, options);
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    const config = (0, config_1.getConfig)();
    return jsonwebtoken_1.default.verify(token, config.jwtSecret);
};
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=jwt.js.map