import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.error("Nieobsługiwana metoda:", req.method);
    return res.status(405).json({ message: "Metoda nieobsługiwana." });
  }

  const { codeToLogin } = req.body;

  console.log("Otrzymane codeToLogin:", codeToLogin);

  if (!codeToLogin || codeToLogin.trim().length === 0) {
    console.error("Brak codeToLogin!");
    return res.status(400).json({ success: false, message: "Brak codeToLogin!" });
  }

  try {
    console.log("Wyszukiwanie użytkownika w bazie danych...");

    const user = await prisma.user.findFirst({
      where: { codeToLogin: codeToLogin },  // Szukamy użytkownika po codeToLogin
    });

    if (!user) {
      console.error("Nie znaleziono użytkownika dla codeToLogin:", codeToLogin);
      return res.status(404).json({ success: false, message: "Nie znaleziono użytkownika!" });
    }

    console.log("Znaleziony użytkownik:", user);

    return res.status(200).json({
      success: true,
      userId: user.userId,
      codeToLogin: user.codeToLogin,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    console.error("Błąd podczas komunikacji z bazą danych:", error);
    return res.status(500).json({ success: false, message: "Wystąpił błąd!" });
  } finally {
    await prisma.$disconnect();
  }
}
