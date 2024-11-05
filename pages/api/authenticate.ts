// api/authentificate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, userName } = req.body;

  // Lista unikalnych kodów dla użytkowników, w tym kod admina
  const validUsers = [
    { code: "abc123", userName: "Jan" },
    { code: "xyz789", userName: "Anna" },
    { code: "admin", userName: "admin" },
  ];

  const user = validUsers.find((user) => user.code === code);

  if (user) {
    const role = code === "admin" ? "admin" : "user";
    res.status(200).json({ success: true, role, name: user.userName, userId: code });
  } else {
    res.status(401).json({ success: false, message: "Nieprawidłowy kod!" });
  }
}