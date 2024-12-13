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
      console.error("Błąd podczas pobierania koszyków:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { userId, cart } = req.body;
      if (!userId || !cart) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
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
      console.error("Błąd podczas dodawania koszyka:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "PATCH") {
    try {
      if (!cartId || !productId) {
        return res.status(400).json({ error: "Brak wymaganych parametrów" });
      }

      const cartProduct = await prisma.cartProduct.findFirst({
        where: {
          cartId: cartId as string,
          productId: productId as string,
        },
      });

      if (!cartProduct) {
        return res.status(404).json({ error: "Nie znaleziono produktu w koszyku" });
      }

      const updatedCartProduct = await prisma.cartProduct.update({
        where: {
          id: cartProduct.id,
        },
        data: { quantity: req.body.quantity },
      });

      return res.status(200).json(updatedCartProduct);
    } catch (error) {
      console.error("Błąd podczas aktualizacji koszyka:", error);
      return res.status(500).json({ error: "Nie można zaktualizować koszyka" });
    }
  }

  if (req.method === "DELETE" && cartId && !productId) {
    try {
      await prisma.cartProduct.deleteMany({
        where: {
          cartId: cartId as string,
        },
      });
  
      const deletedCart = await prisma.cart.delete({
        where: {
          cartId: cartId as string,
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "Koszyk został pomyślnie usunięty",
        deletedCart,
      });
    } catch (error) {
      console.error("Błąd podczas usuwania koszyka:", error);
      return res.status(500).json({ error: "Nie można usunąć koszyka" });
    }
  }
}