import { useState, useEffect } from "react"; // Importuj useEffect
import { useRouter } from "next/router";
import styles from "../styles/loginPage.module.scss";

const LoginPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Resetuj stan błędu tylko po stronie klienta
    setError("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }), // Przesyłamy tylko kod
    });

    const data = await response.json();

    if (data.success) {
      if (data.role === "admin") {
        router.push("/admin"); // Przekierowanie do panelu admina
      } else {
        router.push(`/products?user=${data.userId}`); // Przekierowanie dla użytkownika
      }
    } else {
      setError(data.message || "Nieprawidłowy kod!"); // Użyj komunikatu z API
    }
  };

  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Wpisz kod"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Zaloguj się</button>
      </form>
      {error && <p>{error}</p>} {/* Wyświetlenie błędu */}
    </div>
  );
};

export default LoginPage;
