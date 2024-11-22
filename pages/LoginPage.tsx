// pages/LoginPage.tsx
import { useState, useEffect } from "react";
import styles from "../styles/loginPage.module.scss";
import { UserProvider, useUser } from "../context/UserContext";
import router from "next/router";
import Bottle from "./Bottle";

const LoginPage = () => {
  const { setUser, user } = useUser();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log("Odpowiedź z API:", data);

      if (data.success) {
        // Ustaw użytkownika w kontekście
        setUser({
          userId: data.userId,
          userName: data.userName,
          role: data.role,
        });
      } else {
        setError(data.message || "Nieprawidłowy kod!");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Przekierowanie po ustawieniu użytkownika
    if (user) {
      if (user.role === "admin") {
        router.push("/AdminPage");
      } else {
        router.push(`/UserPage?${user.userName}`);
      }
    }
  }, [user]); // Nasłuchuj na zmiany w stanie użytkownika

  return (
    <div className={styles.login}>
      <div className={styles.login__form}>
        <h1 className={styles.login__title}>WINETU</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Wpisz swój kod"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={styles.login__input}
            required
          />
          <button
            type="submit"
            className={styles.login__button}
            disabled={isLoading}
          >
            {isLoading ? "Logowanie..." : "Wejdź"}
          </button>
        </form>
        {error && <p className={styles.login__error}>{error}</p>}
      </div>
      <Bottle />
    </div>
  );
};

const WrappedLoginPage = () => (
  <UserProvider>
    <LoginPage />
  </UserProvider>
);

export default WrappedLoginPage;
