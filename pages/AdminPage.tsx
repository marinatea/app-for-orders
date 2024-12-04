import { useEffect, useState } from "react";
import styles from "../styles/adminPage.module.scss";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import Send from "../img/send.png";
import CheckboxDone from "../img/checkbox-full.png";
import Checkbox from "../img/checkbox.png";

import WineBottle from "./Bottle";
import { Cart, Product, CartProduct } from "../utils/types";

const AdminPage = () => {
  const { user } = useUser();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await fetch("/api/cart");
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania danych zamówień");
        }
        const data: Cart[] = await response.json();
        setCarts(data);
      } catch (error) {
        console.error("Błąd podczas pobierania koszyków:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Błąd w odpowiedzi API");
        }
        const data: Product[] = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Błąd podczas pobierania produktów:", error);
      }
    };

    fetchCarts();
    fetchProducts();
  }, []);

  const getOrderLink = (productId: string) => {
    const product = products.find((p) => p.productId === productId);
    if (!product) {
      console.warn(`Nie znaleziono produktu dla ID: ${productId}`);
      return "#";
    }
    return product.orderLink;
  };

  const toggleProductOrdered = async (
    cartIndex: number,
    cartProductId: number
  ) => {
    try {
      const updatedCarts = [...carts];
      const cartProduct = updatedCarts[cartIndex].products.find(
        (item) => item.id === cartProductId
      );
      if (cartProduct) {
        cartProduct.ordered = !cartProduct.ordered;
        setCarts(updatedCarts);

        await fetch(`/api/cart/${cartIndex}/product/${cartProductId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ordered: cartProduct.ordered }),
        });
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas aktualizacji produktu:", error);
    }
  };

  if (products.length === 0) {
    return <div>Ładowanie danych produktów...</div>;
  }

  if (user && user.role !== "admin") {
    return <div>Brak uprawnień do wyświetlania tej strony.</div>; // Sprawdzanie roli użytkownika
  }

  return (
    <div className={styles.admin}>
      <h1 className={styles.admin__header}>Panel Admina</h1>
      {carts.length === 0 ? (
        <p className={styles.admin__noOrders}>Brak zamówień do wyświetlenia.</p>
      ) : (
        carts.map((cart, index) => (
          <div key={cart.cartId} className={styles.admin__cart}>
            <h3>Użytkownik: {cart.userName}</h3>
            <ul>
              {cart.products.map((cartProduct: CartProduct) => (
                <li key={cartProduct.id} className={styles.admin__cart__item}>
                  {cartProduct.product.name} - {cartProduct.quantity} szt.
                  <div className={styles.admin__cart__optionsWrapper}>
                    <div
                      className={styles.admin__checkbox}
                      onClick={() =>
                        toggleProductOrdered(index, cartProduct.id)
                      }
                    >
                      <Image
                        src={cartProduct.ordered ? CheckboxDone : Checkbox}
                        alt={
                          cartProduct.ordered ? "Zaznaczone" : "Niezaznaczone"
                        }
                      />
                    </div>
                    <button className={styles.admin__delete}>
                      <a
                        href={getOrderLink(cartProduct.product.productId)}
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

export default AdminPage;
