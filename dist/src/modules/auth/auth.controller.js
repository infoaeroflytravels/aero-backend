"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.me = me;
exports.logout = logout;
const auth_service_1 = require("./auth.service");
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(name, email, password);
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: err?.message || "Registration failed" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.validateUser)(email, password);
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const { accessToken, refreshToken } = await (0, auth_service_1.createSessionAndTokens)(user, req.ip, req.get("user-agent") || "");
        // set refresh token in httpOnly cookie, access token in response body
        res.cookie("jid", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 604800) * 1000,
            path: "/api/auth/refresh"
        });
        res.json({
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });
    }
}
async function refresh(req, res) {
    try {
        const token = req.cookies["jid"];
        if (!token)
            return res.status(401).json({ message: "No refresh token" });
        // verify token
        // (we reuse jwt utils directly here)
        const { verifyRefreshToken } = require("../../utils/jwt");
        const payload = verifyRefreshToken(token);
        // ensure session exists
        const session = await require("../../utils/db").prisma.session.findFirst({ where: { refreshToken: token } });
        if (!session)
            return res.status(401).json({ message: "Invalid session" });
        const user = await require("../../utils/db").prisma.user.findUnique({ where: { id: payload.id } });
        const { accessToken, refreshToken: newRefresh } = await (0, auth_service_1.createSessionAndTokens)(user, req.ip, req.get("user-agent") || "");
        // rotate refresh token: delete old session, set new cookie & save new session
        await require("../../utils/db").prisma.session.deleteMany({ where: { refreshToken: token } });
        res.cookie("jid", newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 604800) * 1000,
            path: "/api/auth/refresh"
        });
        res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid refresh token" });
    }
}
async function me(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: "Not authenticated" });
    const user = await require("../../utils/db").prisma.user.findUnique({ where: { id: userId } });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
async function logout(req, res) {
    try {
        const token = req.cookies["jid"];
        if (token) {
            await (0, auth_service_1.revokeRefreshToken)(token);
            res.clearCookie("jid", { path: "/api/auth/refresh" });
        }
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Logout failed" });
    }
}
