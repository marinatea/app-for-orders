import type { NextApiRequest, NextApiResponse } from "next";

let cartData: {
  user: string;
  cart: { id: number; quantity: number }[];
  isFinalized: boolean;
  userName: string;
}[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { user, cart, userName } = req.body;

    cartData.push({ user, cart, isFinalized: false, userName });

    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    res.status(200).json(cartData);
  } else if (req.method === "DELETE") {
    cartData = []; // Wyczyszczenie wszystkich zamówień
    res.status(200).json({
      success: true,
      message: "Wszystkie zamówienia zostały usunięte.",
    });
  } else {
    res.status(405).json({ success: false, message: "Metoda nieobsługiwana." });
  }
}
