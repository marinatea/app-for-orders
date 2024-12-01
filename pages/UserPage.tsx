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

  const addToCart = async (product: Product, quantity: number) => {
    if (!user || !user.userId) {
      alert("Musisz być zalogowany, aby dodać produkt do koszyka.");
      return;
    }
  
    if (quantity > 0) {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: user.userId },
          cart: [{ id: product.id, quantity }],
        }),
      });
  
      if (response.ok) {
        alert("Produkt dodany do koszyka!");
      } else {
        alert("Błąd podczas dodawania produktu do koszyka");
      }
    }
  };
  

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert(
        "Twój koszyk jest pusty. Dodaj produkty przed złożeniem zamówienia."
      );
      return;
    }

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, cart, isFinalized: true }),
    });

    if (response.ok) {
      alert("Zamówienie zostało zapisane i ostatecznie zatwierdzone.");
      setCart([]);
      setQuantities({});
    } else {
      alert("Błąd podczas składania zamówienia.");
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
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
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
          <li key={product.id} className={styles.products__item}>
            <span className={styles.products__item__name}>{product.name}</span>
            <input
              type="number"
              min="1"
              value={quantities[product.id] || ""}
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

      <button onClick={handleCheckout} className={styles.products__button}>
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
