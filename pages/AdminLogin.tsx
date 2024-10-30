//pages/AdminLogin.tsx
import { useState } from "react";
import { useRouter } from "next/router";

const AdminLoginPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (data.success && data.role === "admin") {
      router.push("/admin");
    } else {
      setError("Nieprawidłowe hasło!");
    }
  };

  return (
    <div>
      <h1>Logowanie administratora</h1>
      <form onSubmit={handleAdminLogin}>
        <input
          type="code"
          placeholder="Wpisz hasło"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Zaloguj się</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AdminLoginPage;
