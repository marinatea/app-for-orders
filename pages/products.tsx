import { useState } from "react";
import styles from "../styles/productsPage.module.scss";
import productsData from "../data/products.json";

interface Product {
  id: number;
  name: string;
  description: string;
  quantity?: number;
  orderLink: string;
}

const ProductsPage = ({ user }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity > 0) {
      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.id === product.id);

        if (existingProduct) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity } : item
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

    // Wysyłamy zamówienie jako zatwierdzone
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, cart, isFinalized: true }),
    });

    alert("Zamówienie zostało zapisane i ostatecznie zatwierdzone.");
  };

  return (
    <div className={styles.products}>
      <h1 className={styles.products__header}>Produkty</h1>
      <ul className={styles.products__list}>
        {productsData.map((product: Product) => (
          <li key={product.id} className={styles.products__item}>
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

export default ProductsPage;
