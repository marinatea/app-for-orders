// pages/UserPage.tsx
import { useState } from "react";
import { UserProvider, useUser } from "../context/UserContext"; // Importuj kontekst
import styles from "../styles/userPage.module.scss";
import { client } from "../lib/client";
import Image from "next/image";
import arrowLeft from "../img/arrow-left.png";
import arrowRight from "../img/arrow-right.png";

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

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return getFilteredAndSortedProducts().slice(startIndex, endIndex);
  };

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
    new Set(
      initialProducts.map((product: Product) => product.category)
    ) as Set<string>
  ).sort((a, b) => a.localeCompare(b));

  const totalPages = Math.ceil(
    getFilteredAndSortedProducts().length / productsPerPage
  );
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.products}>
      <h1 className={styles.products__header}>Produkty</h1>
      <h2>Użytkownik: {user?.userName || "Nie zalogowany"}</h2>
      <section className={styles.products__sortWrapper}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.products__filter}
        >
          <option className={styles.products__filter} value="">
            Wszystkie kategorie
          </option>
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
        {getPaginatedProducts().map((product: Product) => (
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
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.pagination__button}
        >
          {currentPage > 1 && <Image src={arrowLeft} alt="arrow-left" />}
        </button>
        <span className={styles.pagination__info}>
          Strona {currentPage} z {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.pagination__button}
        >
          {currentPage < totalPages && (
            <Image src={arrowRight} alt="arrow-right" />
          )}
        </button>
      </div>
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
