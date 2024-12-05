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
      return res.status(200).json(products);
    } catch (error) {
      console.error("Błąd podczas pobierania produktów:", error);
      return res.status(500).json({ error: "Nie można pobrać produktów" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, orderLink, category, store } = req.body;

      const product = await prisma.product.create({
        data: { name, orderLink, category, store },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Błąd podczas dodawania produktu:", error);
      return res.status(500).json({ error: "Nie można dodać produktu" });
    }
  }

  return res.status(405).json({ message: "Metoda niedozwolona" });
}
