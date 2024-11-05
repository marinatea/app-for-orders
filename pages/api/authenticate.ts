// api/authenticate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

// Ustawienia Sanity
const client = sanityClient({
  projectId: 'pmpsddkp', // Twój projectId
  dataset: 'products', // Twój dataset
  useCdn: true, // Używaj CDN dla wydajności
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  // Sprawdź, czy userId został przesłany
  if (!userId) {
    return res.status(400).json({ success: false, message: "Brak userId!" });
  }

  // Wyszukaj użytkownika w Sanity
  const query = `*[_type == "user" && userId == $userId][0]`;
  const params = { userId };

  try {
    const user = await client.fetch(query, params);

    if (user) {
      const role = user.role;
      res.status(200).json({ success: true, role, userName: user.userName, userId });
    } else {
      res.status(401).json({ success: false, message: "Nieprawidłowy kod!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Wystąpił błąd!" });
  }
}
