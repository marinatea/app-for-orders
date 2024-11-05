import { useEffect, useState } from "react";
import styles from "../styles/adminPage.module.scss";
import { UserProvider, useUser } from "../context/UserContext";

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
  userName: string;
  cart: CartItem[];
}

const AdminPage = () => {
  const { user } = useUser();
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
        setProducts(data.result || []);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów z Sanity:", error);
      }
    };

    fetchCarts();
    fetchProducts();
  }, []);

  const getOrderLink = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.orderLink : "#";
  };

  const deleteAllCarts = async () => {
    const response = await fetch("/api/cart", { method: "DELETE" });
    if (response.ok) {
      setCarts([]);
      alert("Wszystkie zamówienia zostały usunięte.");
    } else {
      console.error("Błąd podczas usuwania zamówień");
    }
  };

  return (
    <div className={styles.admin}>
      <h1 className={styles.admin__header}>Panel Admina</h1>
      <h2>Użytkownik: {user?.userName || 'Nie zalogowany'}</h2>
      <button onClick={deleteAllCarts} className={styles.admin__button}>
        Usuń wszystkie zamówienia
      </button>
      {carts.length === 0 ? (
        <p className={styles.admin__noOrders}>Brak zamówień do wyświetlenia.</p>
      ) : (
        carts.map((cart, index) => (
          <div key={index} className={styles.admin__cart}>
            <h3>Użytkownik: {cart.userName}</h3>
            <ul>
              {cart.cart.map((item) => (
                <li key={item._id} className={styles.admin__cart__item}>
                  {item.name} - {item.quantity} szt.
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

const WrappedAdminPage = (props) => (
  <UserProvider>
    <AdminPage {...props} />
  </UserProvider>
);

export default WrappedAdminPage;
