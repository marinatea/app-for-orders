import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany();

      res.status(200).json(products);
    } catch (error) {
      console.error("Błąd podczas pobierania produktów:", error);
      res.status(500).json({ error: "Nie udało się pobrać produktów." });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: "Metoda nieobsługiwana." });
  }
}
