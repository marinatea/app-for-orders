import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Product } from "../../utils/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cartIndex, productId } = req.query;

  // Obsługuje zapytanie GET do pobrania wszystkich koszyków
  if (req.method === "GET") {
    try {
      const carts = await prisma.cart.findMany({
        include: { products: true },
      });
      return res.status(200).json(carts);
    } catch (error) {
      console.error("Błąd podczas pobierania koszyków:", error);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  // Obsługuje zapytanie PATCH do aktualizacji koszyka
  if (req.method === "PATCH") {
    try {
      if (!cartIndex || !productId) {
        return res.status(400).json({ error: "Brak wymaganego parametru" });
      }

      const updatedCart = await prisma.cart.update({
        where: { cartId: String(cartIndex) },
        data: {
          products: {
            update: {
              where: { productId: productId as string },
              data: { ordered: req.body.ordered },
            },
          },
        },
      });

      return res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Błąd podczas aktualizacji koszyka:", error);
      return res
        .status(500)
        .json({ error: "Nie udało się zaktualizować koszyka" });
    }
  }

  // Obsługuje zapytanie DELETE do usuwania produktu z koszyka
  if (req.method === "DELETE") {
    try {
      if (!cartIndex || !productId) {
        return res.status(400).json({ error: "Brak wymaganego parametru" });
      }

      await prisma.cart.update({
        where: { cartId: String(cartIndex) },
        data: {
          products: {
            delete: { productId: productId as string },
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Produkt usunięty" });
    } catch (error) {
      console.error("Błąd podczas usuwania produktu:", error);
      return res.status(500).json({ error: "Nie udało się usunąć produktu" });
    }
  }

  // Obsługuje zapytanie POST do tworzenia nowego koszyka
  if (req.method === "POST") {
    try {
      const { user, cart } = req.body; // user i cart przychodzą z frontend
      if (!user || !cart) {
        return res
          .status(400)
          .json({ error: "Brak danych do zapisania koszyka" });
      }

      // Dodajemy koszyk użytkownika do bazy danych
      const savedCart = await prisma.cart.create({
        data: {
          userId: user.id, // Zakładając, że masz relację z użytkownikiem
          products: {
            create: cart.map((product: Product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      return res.status(200).json(savedCart);
    } catch (error) {
      console.error("Błąd podczas dodawania koszyka:", error);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }
  return res.status(405).json({ message: "Metoda nieobsługiwana" });
}
