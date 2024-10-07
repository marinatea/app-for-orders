// /pages/api/cart.ts
import type { NextApiRequest, NextApiResponse } from "next";

let cartData: {
  user: string;
  cart: { id: number; quantity: number }[];
  isFinalized: boolean;
}[] = []; // Pseudo baza danych

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { user, cart } = req.body;

    // Sprawdź, czy użytkownik już ma niezatwierdzone zamówienie
    const existingCart = cartData.find(
      (c) => c.user === user && !c.isFinalized
    );
    if (existingCart) {
      existingCart.cart = cart; // Nadpisz zamówienie
    } else {
      cartData.push({ user, cart, isFinalized: false });
    }

    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    res.status(200).json(cartData);
  } else if (req.method === "DELETE") {
    res.status(200).json({
      success: true,
      message: "Wszystkie zamówienia zostały usunięte.",
    });
  } else {
    res.status(405).json({ success: false, message: "Metoda nieobsługiwana." });
  }
}
