// pages/UserPage.tsx
import { useState } from "react";
import { UserProvider, useUser } from "../context/UserContext"; // Importuj kontekst
import styles from "../styles/productsPage.module.scss";
import { client } from "../lib/client";

interface Product {
  _id: number;
  category: string;
  name: string;
  description: string;
  quantity?: number;
  orderLink: string;
}

const UserPage = ({ initialProducts }) => {
  const { user } = useUser();
  const [cart, setCart] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product._id]: quantity,
      }));
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
    setQuantities({});
  };

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = initialProducts;

    // Filtrowanie po kategorii
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product: Product) => product.category === selectedCategory
      );
    }

    // Sortowanie po nazwie
    filteredProducts.sort((a: Product, b: Product) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filteredProducts;
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const uniqueCategories: string[] = Array.from(
    new Set(initialProducts.map((product) => product.category))
  );

  return (
    <div className={styles.products}>
      <h1 className={styles.products__header}>Produkty</h1>
      <h2>Użytkownik: {user?.userName || "Nie zalogowany"}</h2>
      <section>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.products__filter}
        >
          <option value="">Wszystkie kategorie</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button
          onClick={toggleSortOrder}
          className={styles.products__sortButton}
        >
          Sortuj od {sortOrder === "asc" ? "A do Z" : "Z do A"}
        </button>
      </section>
      <ul className={styles.products__list}>
        {getFilteredAndSortedProducts().map((product: Product) => (
          <li key={product._id} className={styles.products__item}>
            <span className={styles.products__item__name}>{product.name}</span>
            <input
              type="number"
              min="1"
              value={quantities[product._id] || ""}
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
    <UserPage {...props} />
  </UserProvider>
);

export default WrappedProductsPage;
