"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // Create an admin user
    const passwordHash = await bcryptjs_1.default.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@visa.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@visa.com",
            password: passwordHash,
            role: "ADMIN",
        },
    });
    console.log("✅ Seed completed successfully!");
    console.log(admin);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
