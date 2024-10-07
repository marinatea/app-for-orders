import { useEffect, useState } from "react";
import styles from "../styles/adminPage.module.scss";
import productsData from "../data/products.json";

const AdminPage = () => {
  const [carts, setCarts] = useState([]);

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

    fetchCarts();
  }, []);

  const getOrderLink = (productId) => {
    const product = productsData.find((p) => p.id === productId);
    return product ? product.orderLink : "#"; // Zwraca link lub #, jeśli nie znaleziono
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
                <li key={item.id} className={styles.admin__cart__item}>
                  {item.name} - {item.quantity} sztuk
                  <button>
                    <a
                      href={getOrderLink(item.id)}
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
