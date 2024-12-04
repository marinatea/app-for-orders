import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cartId, productId } = req.query;

  if (req.method === "GET") {
    try {
      const carts = await prisma.cart.findMany({
        include: {
          user: {
            select: {
              userName: true,
            },
          },
          products: {
            include: {
              product: true,
            },
          },
        },
      });
      const response = carts.map(
        (cart: { user: { userName: string | null } }) => ({
          ...cart,
          userName: cart.user.userName ?? "Unknown",
        })
      );

      res.json(response);
      return res.status(200).json(carts);
    } catch (error) {
      console.error("Error fetching carts:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { userId, cart } = req.body;
      if (!userId || !cart) {
        return res.status(400).json({ error: "Missing required data" });
      }

      const savedCart = await prisma.cart.create({
        data: {
          userId,
          products: {
            create: cart.map(
              (item: { productId: string; quantity: number }) => ({
                productId: item.productId,
                quantity: item.quantity,
              })
            ),
          },
        },
      });

      return res.status(200).json(savedCart);
    } catch (error) {
      console.error("Error adding cart:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "PATCH") {
    try {
      if (!cartId || !productId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      // Krok 1: Znajdź CartProduct na podstawie cartId i productId
      const cartProduct = await prisma.cartProduct.findFirst({
        where: {
          cartId: cartId as string, // Używamy oddzielnych pól
          productId: productId as string, // Używamy oddzielnych pól
        },
      });

      // Sprawdzenie, czy produkt w koszyku istnieje
      if (!cartProduct) {
        return res.status(404).json({ error: "Cart product not found" });
      }

      // Krok 2: Zaktualizuj rekord na podstawie znalezionego ID
      const updatedCartProduct = await prisma.cartProduct.update({
        where: {
          id: cartProduct.id, // Aktualizujemy za pomocą ID rekordu
        },
        data: { quantity: req.body.quantity }, // Aktualizacja ilości
      });

      return res.status(200).json(updatedCartProduct);
    } catch (error) {
      console.error("Error updating cart:", error);
      return res.status(500).json({ error: "Could not update cart" });
    }
  }

  if (req.method === "DELETE") {
    try {
      if (!cartId || !productId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      // Używamy `findFirst` i następnie `delete`
      const cartProduct = await prisma.cartProduct.findFirst({
        where: {
          cartId: cartId as string, // Oddzielnie `cartId` i `productId`
          productId: productId as string, // Oddzielnie `cartId` i `productId`
        },
      });

      if (!cartProduct) {
        return res.status(404).json({ error: "Cart product not found" });
      }

      await prisma.cartProduct.delete({
        where: {
          id: cartProduct.id, // Usuwamy na podstawie `id`
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Product removed" });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      return res.status(500).json({ error: "Could not remove product" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
