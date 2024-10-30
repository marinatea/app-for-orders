import { useState } from "react";
import { client } from "../sanity/lib/client";
import styles from "../styles/productsPage.module.scss";

interface Product {
  _id: number;
  category: string;
  name: string;
  description: string;
  quantity?: number;
  orderLink: string;
}

const ProductsPage = ({ user, initialProducts }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts); // Używamy początkowych danych

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
  };

  return (
    <div className={styles.products}>
      <h1 className={styles.products__header}>Produkty</h1>
      <ul className={styles.products__list}>
        {products.map((product: Product) => (
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

export default ProductsPage;
