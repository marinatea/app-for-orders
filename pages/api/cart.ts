import type { NextApiRequest, NextApiResponse } from "next";

let cartData: {
  user: string;
  cart: { id: string; quantity: number }[];
  isFinalized: boolean;
  userName: string;
}[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cartIndex, productId } = req.query;
  if (req.method === "DELETE") {
    if (cartIndex && productId) {
      const cartIndexNum = parseInt(cartIndex as string);
      const productIdStr = productId as string;

      if (cartIndexNum >= 0 && cartIndexNum < cartData.length) {
        const cart = cartData[cartIndexNum];

        const productIndex = cart.cart.findIndex(
          (item) => item.id === productIdStr
        );

        if (productIndex !== -1) {
          cart.cart.splice(productIndex, 1);
          return res.status(200).json({
            success: true,
            message: "Produkt został usunięty z koszyka.",
          });
        } else {
          return res
            .status(404)
            .json({ error: "Produkt nie znaleziony w koszyku." });
        }
      } else {
        return res.status(404).json({ error: "Koszyk nie znaleziony." });
      }
    }
    return res.status(400).json({ error: "Nieprawidłowe zapytanie." });
  }

  if (req.method === "GET") {
    res.status(200).json(cartData);
  }

  else if (req.method === "POST") {
    const { user, cart, userName } = req.body;

    cartData.push({ user, cart, isFinalized: false, userName });

    res.status(200).json({ success: true });
  }

  else {
    res.status(405).json({ success: false, message: "Metoda nieobsługiwana." });
  }
}
