import { prisma } from "../../utils/db";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { addSeconds } from "date-fns";

export async function registerUser(name: string, email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });
  return user;
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}

export async function createSessionAndTokens(user: any, ip?: string, ua?: string) {
  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  const expiresAt = addSeconds(new Date(), Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 604800));

  await prisma.session.create({
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

export async function revokeRefreshToken(token: string) {
  await prisma.session.deleteMany({ where: { refreshToken: token } });
}
