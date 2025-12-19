"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "default_access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN
    ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10)
    : 900; // default 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10)
    : 604800; // default 7 days
const signAccessToken = (payload) => {
    const options = { expiresIn: ACCESS_TOKEN_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    const options = { expiresIn: REFRESH_TOKEN_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET, options);
};
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
