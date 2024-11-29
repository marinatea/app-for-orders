import { useState, useEffect } from "react";
import styles from "../styles/loginPage.module.scss";
import { UserProvider, useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Bottle from "./Bottle";

// LoginPage komponent
const LoginPage = () => {
  const { setUser, user } = useUser();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Funkcja do obsługi logowania
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Wysłanie zapytania do API
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
        // Jeśli logowanie było udane, ustawiamy użytkownika w kontekście
        setUser({
          id: data.id,
          userId: data.userId,
          userName: data.userName,
          role: data.role,
        });

        // Przekierowanie po udanym logowaniu
        router.push(
          data.role === "admin"
            ? `/AdminPage?userName=${data.userName}`
            : `/UserPage?userName=${data.userName}`
        );
      } else {
        // W przypadku błędu wyświetlamy odpowiedni komunikat
        setError(data.message || "Nieprawidłowy kod!");
      }
    } catch (err) {
      console.error("Błąd podczas logowania:", err);
      setError("Wystąpił błąd podczas logowania. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  // Jeżeli użytkownik już jest zalogowany, przekierowujemy
  useEffect(() => {
    if (user) {
      setRedirecting(true);
      router.push(
        user.role === "admin"
          ? `/AdminPage?userName=${user.userName}`
          : `/UserPage?userName=${user.userName}`
      );
    }
  }, [user, router]);

  if (redirecting) {
    return <div>Przekierowywanie...</div>;
  }

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

// Wrapping LoginPage z kontekstem użytkownika
const WrappedLoginPage = () => (
  <UserProvider>
    <LoginPage />
  </UserProvider>
);

export default WrappedLoginPage;
