// pages/UserPage.tsx
import { useState } from "react";
import { UserProvider, useUser } from "../context/UserContext"; // Importuj kontekst
import styles from "../styles/productsPage.module.scss";
import { client } from "../lib/client";
import router from "next/dist/client/router";

interface Product {
  _id: number;
  category: string;
  name: string;
  description: string;
  quantity?: number;
  orderLink: string;
}

const UserPage  = ({ initialProducts }) => {
  const { user } = useUser();
  console.log("Użytkownik z kontekstu:", user);
  const [cart, setCart] = useState<Product[]>([]);
  
  const addToCart = (product: Product, quantity: number) => {
    if (quantity > 0) {
      setCart((prevCart) => {
        const existingProduct = prevCart.find(
          (item) => item._id === product._id
        );

        if (existingProduct) {
          return prevCart.map((item) =>
            item._id === product._id ? { ...item, quantity } : item
          );
        } else {
          return [...prevCart, { ...product, quantity }];
        }
      });
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert(
        "Twój koszyk jest pusty. Dodaj produkty przed złożeniem zamówienia."
      );
      return;
    }

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, cart, isFinalized: true }),
    });

    alert("Zamówienie zostało zapisane i ostatecznie zatwierdzone.");
    setCart([]);
  };

  return (
    <div className={styles.products}>
      <h1 className={styles.products__header}>Produkty</h1>
      <h2>Użytkownik: {user?.userName || 'Nie zalogowany'}</h2>
      <ul className={styles.products__list}>
        {initialProducts.map((product: Product) => (
          <li key={product._id} className={styles.products__item}>
            <span className={styles.products__item__name}>{product.name}</span>
            <input
              type="number"
              min="1"
              onChange={(e) => addToCart(product, Number(e.target.value))}
              className={styles.products__item__input}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout} className={styles.products__button}>
        Złóż zamówienie
      </button>
    </div>
  );
};

export async function getStaticProps() {
  const query = `*[_type == "product"] { _id, category, name, description, orderLink }`;
  const initialProducts = await client.fetch(query);

  return {
    props: {
      initialProducts,
    },
  };
}

const WrappedProductsPage = (props) => (
  <UserProvider>
    <UserPage  {...props} />
  </UserProvider>
);

export default WrappedProductsPage;
