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
  } else if (req.method === "POST") {
    try {
      const { name, price } = req.body;

      const product = await prisma.product.create({
        data: { name, price },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Błąd podczas dodawania produktu:", error);
      res.status(500).json({ error: "Nie udało się dodać produktu." });
    }
  } else {
    res.status(405).json({ message: "Metoda nieobsługiwana." });
  }
}