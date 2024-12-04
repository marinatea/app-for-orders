import { useState, useEffect } from "react";
import { UserProvider, useUser } from "../context/UserContext"; // Importuj kontekst
import styles from "../styles/userPage.module.scss";
import Image from "next/image";
import ArrowLeft from "../img/arrow-left.png";
import ArrowRight from "../img/arrow-right.png";
import WineBottle from "./Bottle";
import { Product } from "../utils/types";

const UserPage = () => {
  const { user } = useUser();
  const [cart, setCart] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStore, setSelectedStore] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          console.error("Błąd odpowiedzi z API:", response.statusText);
          throw new Error("Błąd odpowiedzi z API");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async () => {
    if (!user || !user.userId) {
      alert("Musisz być zalogowany, aby dodać produkt do koszyka.");
      return;
    }
  
    const cartItems = Object.keys(quantities)
    .filter((productId) => quantities[productId] > 0)
    .map((productId) => ({
      id: productId,
      quantity: quantities[productId],
    }));

  if (cartItems.length > 0) {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { id: user.userId },
        cart: cartItems,
      }),
    });

    if (response.ok) {
      alert("Produkty zostały dodane do koszyka!");
      setQuantities({});
    } else {
      alert("Błąd podczas dodawania produktów do koszyka.");
    }
  } else {
    alert("Musisz wybrać co najmniej jeden produkt.");
  }
};
  
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product: Product) => product.category === selectedCategory
      );
    }

    if (selectedStore) {
      filteredProducts = filteredProducts.filter(
        (product: Product) => product.store === selectedStore
      );
    }

    filteredProducts.sort((a: Product, b: Product) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    return filteredProducts;
  };

  const getPaginatedProducts = () => {
    const filteredAndSortedProducts = getFilteredAndSortedProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const uniqueCategories: string[] = Array.from(
    new Set(products.map((product: Product) => product.category))
  ).sort((a, b) => a.localeCompare(b));

  const uniqueStores: string[] = Array.from(
    new Set(products.map((product: Product) => product.store))
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
      <section className={styles.products__sortWrapper}>
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
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className={styles.products__filter}
        >
          <option value="">Wszystkie sklepy</option>
          {uniqueStores.map((store) => (
            <option key={store} value={store}>
              {store}
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
          <li key={product.productId} className={styles.products__item}>
            <span className={styles.products__item__name}>{product.name}</span>
            <input
              type="number"
              min="1"
              value={quantities[product.productId] || ""}
              onChange={(e) =>
                setQuantities({
                  ...quantities,
                  [product.productId]: Number(e.target.value),
                })
              }
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
          {currentPage > 1 && <Image src={ArrowLeft} alt="arrow-left" />}
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
            <Image src={ArrowRight} alt="arrow-right" />
          )}
        </button>
      </div>

      <button onClick={handleAddToCart} className={styles.products__button}>
        Złóż zamówienie
      </button>
      <WineBottle />
    </div>
  );
};

const WrappedUserPage = () => (
  <UserProvider>
    <UserPage />
  </UserProvider>
);

export default WrappedUserPage;
