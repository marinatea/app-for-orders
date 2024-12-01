import { JSX, useEffect, useState } from "react";
import styles from "../styles/adminPage.module.scss";
import { UserProvider, useUser } from "../context/UserContext";
import Image from "next/image";
import Send from "../img/send.png";
import CheckboxDone from "../img/checkbox-full.png"; // Zaznaczony checkbox
import Checkbox from "../img/checkbox.png"; // Domyślny checkbox

import WineBottle from "./Bottle";
import { Cart, Product } from "../utils/types";

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
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Błąd w odpowiedzi API");
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
      }
    };

    fetchCarts();
    fetchProducts();
  }, []);

  const getOrderLink = (productId: string) => {
    if (products.length === 0) {
      console.warn("Brak danych produktów.");
      return "#";
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      console.warn(`Nie znaleziono produktu dla ID: ${productId}`);
      return "#";
    }

    return product.orderLink;
  };

  const toggleProductOrdered = async (cartIndex: number, productId: string) => {
    try {
      const updatedCarts = [...carts];
      const product = updatedCarts[cartIndex].cart.find(
        (item) => item.id === productId
      );
      if (product) {
        product.ordered = !product.ordered;
        setCarts(updatedCarts);

        // Wysyłanie zmian na serwer (opcjonalne)
        await fetch(`/api/cart/${cartIndex}/product/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ordered: product.ordered }),
        });
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas aktualizacji produktu:", error);
    }
  };

  if (products.length === 0) {
    return <div>Ładowanie danych produktów...</div>;
  }

  return (
    <div className={styles.admin}>
      <h1 className={styles.admin__header}>Panel Admina</h1>
      <h3>Użytkownik, który zrobił to zamówienie: ${user?.userName}</h3>
      {carts.length === 0 ? (
        <p className={styles.admin__noOrders}>Brak zamówień do wyświetlenia.</p>
      ) : (
        carts.map((cart, index) => (
          <div key={index} className={styles.admin__cart}>
            <h3>Użytkownik: {cart.userName}</h3>
            <ul>
              {cart.cart.map((item) => (
                <li key={item.id} className={styles.admin__cart__item}>
                  {item.name} - {item.quantity} szt.
                  <div className={styles.admin__cart__optionsWrapper}>
                    <div
                      className={styles.admin__checkbox}
                      onClick={() => toggleProductOrdered(index, item.id)}
                    >
                      <Image
                        src={item.ordered ? CheckboxDone : Checkbox}
                        alt={item.ordered ? "Zaznaczone" : "Niezaznaczone"}
                      />
                    </div>
                    <button className={styles.admin__delete}>
                      <a
                        href={getOrderLink(item.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image src={Send} alt="send" />
                      </a>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <WineBottle />
    </div>
  );
};

const WrappedAdminPage = (props: JSX.IntrinsicAttributes) => (
  <UserProvider>
    <AdminPage {...props} />
  </UserProvider>
);

export default WrappedAdminPage;
