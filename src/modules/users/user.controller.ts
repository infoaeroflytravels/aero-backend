// src/modules/users/user.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../utils/db";

export const getMe = async (req: Request, res: Response) => {
  try {
    // `req.user` comes from your authMiddleware after JWT verification
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
