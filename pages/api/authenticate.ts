import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body; // Odbieramy tylko kod

  // Lista unikalnych kodów dla użytkowników, w tym kod admina
  const validCodes = ["abc123", "xyz789", "adminCode"]; // Dodaj kod administratora
  const ADMIN_CODE = "adminCode"; // Zdefiniowany kod administratora

  // Weryfikacja kodu użytkownika lub kodu administratora
  if (code === ADMIN_CODE) {
    res.status(200).json({ success: true, role: "admin" });
  } else if (validCodes.includes(code)) {
    res.status(200).json({ success: true, role: "user", userId: code });
  } else {
    res.status(401).json({ success: false, message: "Nieprawidłowy kod!" });
  }
}
