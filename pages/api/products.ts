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
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Could not fetch products" });
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
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Could not add product" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
