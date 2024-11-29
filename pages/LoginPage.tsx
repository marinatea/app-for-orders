import { useState, useEffect } from "react";
import styles from "../styles/loginPage.module.scss";
import { UserProvider, useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Bottle from "./Bottle";

// LoginPage komponent
const LoginPage = () => {
  const { setUser, user } = useUser();
  const [codeToLogin, setCodeToLogin] = useState(""); // Używamy codeToLogin
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Funkcja do obsługi logowania
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Zapobiegamy domyślnemu działaniu formularza

    setIsLoading(true); // Ustawiamy stan ładowania

    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codeToLogin: codeToLogin, // Używamy codeToLogin, które jest wprowadzone przez użytkownika
      }),
    });

    const data = await response.json();
    console.log("Odpowiedź z API:", data);

    setIsLoading(false); // Wyłączamy stan ładowania

    if (response.ok) {
      // Jeśli odpowiedź jest ok, zapisujemy dane użytkownika i przekierowujemy
      setUser({
        userId: data.userId,
        userName: data.userName,
        role: data.role,
        codeToLogin: data.codeToLogin,
      });

      router.push(
        data.role === "admin"
          ? `/AdminPage?userName=${data.userName}`
          : `/UserPage?userName=${data.userName}`
      );
    } else {
      // Jeśli wystąpił błąd, wyświetlamy komunikat o błędzie
      setError(data.message);
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
            placeholder="Wpisz swój codeToLogin"
            value={codeToLogin} // Używamy codeToLogin jako wartości formularza
            onChange={(e) => setCodeToLogin(e.target.value)} // Aktualizujemy stan codeToLogin
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
