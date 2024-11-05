//pages/AdminLogin.tsx
import { useState } from "react";
import { useRouter } from "next/router";

const AdminLoginPage = () => {
  const [userId, setuserId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    if (data.success && data.role === "admin") {
      router.push("/AdminPage");
    } else {
      setError("Nieprawidłowe hasło!");
    }
  };

  return (
    <div>
      <h1>Logowanie administratora</h1>
      <form onSubmit={handleAdminLogin}>
        <input
          type="userId"
          placeholder="Wpisz hasło"
          value={userId}
          onChange={(e) => setuserId(e.target.value)}
        />
        <button type="submit">Zaloguj się</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AdminLoginPage;
