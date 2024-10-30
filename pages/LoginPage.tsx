// pages/LoginPage.tsx
import { useState, useEffect } from "react";
import styles from "../styles/loginPage.module.scss";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Resetowanie błędu
    setError("");

    // Logowanie zmiennych środowiskowych
    console.log("Sanity API Version:", process.env.NEXT_PUBLIC_SANITY_API_VERSION);
    console.log("Sanity Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log("Sanity Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log("Sanity API Token:", process.env.NEXT_PUBLIC_SANITY_API_TOKEN);
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
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}` // Jeśli to potrzebne
        },
        body: JSON.stringify({ code }),
      });
      

      const data = await response.json();

      if (data.success) {
        if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push(`/products?user=${data.userId}`);
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
        <h1 className={styles.login__title}>WINETU Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Wpisz kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.login__input}
            required
          />
          <button 
            type="submit" 
            className={styles.login__button}
            disabled={isLoading}
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
        {error && <p className={styles.login__error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
