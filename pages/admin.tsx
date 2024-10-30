import { useEffect, useState } from "react";
import styles from "../styles/adminPage.module.scss";
import { client } from "../sanity/lib/client";

interface Product {
  _id: string;
  name: string;
  orderLink: string;
}

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
}

interface Cart {
  cart: CartItem[];
}

const AdminPage = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCarts = async () => {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCarts(data);
      } else {
        console.error("Błąd podczas pobierania danych zamówień");
      }
    };

    const fetchProducts = async () => {
      try {
        // Logowanie tokenu do debugowania
        console.log("Token API:", process.env.SANITY_API_TOKEN);
    
        const response = await fetch(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-10-29/data/query/production`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error("Błąd w odpowiedzi API");
        }
    
        const data = await response.json();
        console.log("Pobrane produkty:", data.result);
        setProducts(data.result || []);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów z Sanity:", error);
      }
    };
    

    fetchCarts();
    fetchProducts();
  }, []);

  const getOrderLink = (productId: string) => {
    // Sprawdź, czy products jest zdefiniowane
    if (!products || products.length === 0) {
      return "#"; // Lub inna logika, np. informacja o braku produktów
    }

    const product = products.find((p) => p._id === productId);
    return product ? product.orderLink : "#"; // Zwraca link lub "#", jeśli nie znaleziono
  };

  const deleteAllCarts = async () => {
    const response = await fetch("/api/cart", { method: "DELETE" });
    if (response.ok) {
      setCarts([]); // Wyczyść lokalny stan po usunięciu zamówień
      alert("Wszystkie zamówienia zostały usunięte.");
    } else {
      console.error("Błąd podczas usuwania zamówień");
    }
  };

  return (
    <div className={styles.admin}>
      <h1 className={styles.admin__header}>Panel Admina</h1>
      <button onClick={deleteAllCarts} className={styles.admin__button}>
        Usuń wszystkie zamówienia
      </button>
      {carts.length === 0 ? (
        <p className={styles.admin__noOrders}>Brak zamówień do wyświetlenia.</p>
      ) : (
        carts.map((cart, index) => (
          <div key={index} className={styles.admin__cart}>
            <ul>
              {cart.cart.map((item) => (
                <li key={item._id} className={styles.admin__cart__item}>
                  {item.name} - {item.quantity} sztuk
                  <button>
                    <a
                      href={getOrderLink(item._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.admin__cart__link}
                    >
                      Zamów produkt
                    </a>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPage;
