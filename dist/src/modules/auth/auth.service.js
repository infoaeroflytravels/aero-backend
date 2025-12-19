"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.validateUser = validateUser;
exports.createSessionAndTokens = createSessionAndTokens;
exports.revokeRefreshToken = revokeRefreshToken;
const db_1 = require("../../utils/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const date_fns_1 = require("date-fns");
async function registerUser(name, email, password) {
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await db_1.prisma.user.create({
        data: { name, email, password: hashed },
    });
    return user;
}
async function validateUser(email, password) {
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return null;
    const ok = await bcryptjs_1.default.compare(password, user.password);
    return ok ? user : null;
}
async function createSessionAndTokens(user, ip, ua) {
    const accessToken = (0, jwt_1.signAccessToken)({ id: user.id, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ id: user.id });
    const expiresAt = (0, date_fns_1.addSeconds)(new Date(), Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 604800));
    await db_1.prisma.session.create({
        data: {
            userId: user.id,
            refreshToken,
            ip,
            userAgent: ua,
            expiresAt,
        },
    });
    return { accessToken, refreshToken, user };
}
async function revokeRefreshToken(token) {
    await db_1.prisma.session.deleteMany({ where: { refreshToken: token } });
}
