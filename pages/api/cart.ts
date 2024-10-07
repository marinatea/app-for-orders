// /pages/api/cart.ts
import type { NextApiRequest, NextApiResponse } from 'next';

let cartData: { user: string; cart: any[]; isFinalized: boolean }[] = []; // Pseudo baza danych

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { user, cart } = req.body;

    // Sprawdź, czy użytkownik już ma niezatwierdzone zamówienie
    const existingCart = cartData.find(c => c.user === user && !c.isFinalized);

    if (existingCart) {
      existingCart.cart = cart; // Nadpisz istniejące zamówienie
    } else {
      // Dodaj nowe zamówienie, jeśli użytkownik nie ma jeszcze aktywnego zamówienia
      cartData.push({ user, cart, isFinalized: false });
    }

    res.status(200).json({ success: true, message: 'Koszyk został zaktualizowany' });
  } 
  else if (req.method === 'GET') {
    res.status(200).json(cartData); // Zwraca wszystkie zamówienia, także te niezatwierdzone
  } 
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
