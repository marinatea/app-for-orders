// pages/LoginPage.tsx
import { useState, useEffect } from "react";
import styles from "../styles/loginPage.module.scss";
import { useRouter } from "next/router";
import { UserProvider, useUser } from "../context/UserContext";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    setError("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}`, // Jeśli to potrzebne
        },
        body: JSON.stringify({ userId, userName }),
      });

      const data = await response.json();
      console.log("Odpowiedź z API:", data); // Zobacz, co jest zwracane


      if (data.success) {
        setUser({ userId: data.userId, userName: data.name || userName });

        if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push(`/products?userId=${data.userId}`);
        }
      } else {
        setError(data.message || "Nieprawidłowy kod!");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__form}>
        <h1 className={styles.login__title}>WINETU</h1>
        <form onSubmit={handleSubmit}>
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
    </div>
  );
};

const WrappedLoginPage = () => (
  <UserProvider>
    <LoginPage />
  </UserProvider>
);

export default WrappedLoginPage;
