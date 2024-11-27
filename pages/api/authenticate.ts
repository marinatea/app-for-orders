//api/authenticate.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Brak userId!" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (user) {
      res.status(200).json({
        success: true,
        role: user.role,
        userName: user.userName,
        userId,
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Nie znaleziono użytkownika!" });
    }
  } catch (error) {
    console.error("Błąd podczas komunikacji z bazą danych:", error);
    res.status(500).json({ success: false, message: "Wystąpił błąd!" });
  } finally {
    await prisma.$disconnect();
  }
}
