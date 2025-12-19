"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.initDb = initDb;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function initDb() {
    await exports.prisma.$connect();
    console.log("Prisma: connected");
}
