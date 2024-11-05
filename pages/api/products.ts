import type { NextApiRequest, NextApiResponse } from "next";

// Typ produktu
interface Product {
  _id: string;
  name: string;
  orderLink: string;
  description?: string;
  category?: string;
  store?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const sanityApiUrl = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${process.env.NEXT_PUBLIC_SANITY_API_VERSION}/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
      const query = `*[_type == "product"]{_id, name, orderLink, description, category, store}`;

      const response = await fetch(`${sanityApiUrl}?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd w odpowiedzi API: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data.result);
    } catch (error) {
      console.error("Błąd podczas pobierania produktów:", error);
      res.status(500).json({ error: "Nie udało się pobrać produktów." });
    }
  } else {
    res.status(405).json({ message: "Metoda nieobsługiwana." });
  }
}
