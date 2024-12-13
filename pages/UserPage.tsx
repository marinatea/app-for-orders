import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import styles from "../styles/userPage.module.scss";
import Image from "next/image";
import ArrowLeft from "../img/arrow-left.png";
import ArrowRight from "../img/arrow-right.png";
import WineBottle from "./Bottle";
import { Product } from "../utils/types";

const UserPage = () => {
  const { user } = useUser();

  const [quantities, setQuantities] = useState<
    { productId: string; quantity: number }[]
  >([]);
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
        const data = await response.json();
        console.log("Fetched Products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const index = updatedQuantities.findIndex(
        (item) => item.productId === productId
      );

      if (index !== -1) {
        updatedQuantities[index].quantity = quantity;
      } else {
        updatedQuantities.push({ productId, quantity });
      }

      return updatedQuantities;
    });
  };

  const handleAddToCart = async () => {
    if (!user?.userId) {
      alert("Musisz być zalogowany(-na), żeby dodać produkt do koszyka.");
      return;
    }

    const cartItems = quantities.filter((item) => item.quantity > 0);

    if (cartItems.length > 0) {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId, cart: cartItems }),
        });

        if (response.ok) {
          alert("Produkty dodane do koszyka!");
          setQuantities([]);
        } else {
          alert("Błąd podczas dodawania produktów do koszyka.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Wybierz co najmniej jeden produkt.");
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
      {user && (
        <h2 className={styles.products__header__username}>
          Użytkownik: {user?.userName}
        </h2>
      )}
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
            <div className={styles.products__item__wrapper}>
              {" "}
              <span className={styles.products__item__name}>
                {product.name}
              </span>
              <span className={styles.products__item__description}>
                {product.description}
              </span>
            </div>

            <input
              type="number"
              min="1"
              value={
                quantities.find((item) => item.productId === product.productId)
                  ?.quantity || ""
              }
              onChange={(e) =>
                updateQuantity(product.productId, Number(e.target.value))
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

      {user && (
        <button onClick={handleAddToCart} className={styles.products__button}>
          Złóż zamówienie
        </button>
      )}
      <WineBottle />
    </div>
  );
};

export default UserPage;
