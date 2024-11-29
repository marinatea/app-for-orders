// api/authenticate.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metoda nieobsługiwana." });
  }

  const { userId } = req.body;  // Otrzymujemy tylko userId (kod)

  if (!userId) {
    return res.status(400).json({ success: false, message: "Brak userId!" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Nie znaleziono użytkownika!" });
    }

    return res.status(200).json({
      success: true,
      id: user.id,
      userId: user.userId,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    console.error("Błąd podczas komunikacji z bazą danych:", error);
    res.status(500).json({ success: false, message: "Wystąpił błąd!" });
  } finally {
    await prisma.$disconnect();
  }
}
