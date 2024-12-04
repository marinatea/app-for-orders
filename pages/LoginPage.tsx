import { useState, useEffect } from "react";
import styles from "../styles/loginPage.module.scss";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Bottle from "./Bottle";

// LoginPage komponent
const LoginPage = () => {
  const { setUser, user } = useUser();
  const [codeToLogin, setCodeToLogin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Funkcja do obsługi logowania
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codeToLogin: codeToLogin, 
      }),
    });

    const data = await response.json();
    console.log("Odpowiedź z API:", data);

    setIsLoading(false);

    if (response.ok) {
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
      setError(data.message);
    }
  };

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
            value={codeToLogin}
            onChange={(e) => setCodeToLogin(e.target.value)}
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

export default LoginPage;
