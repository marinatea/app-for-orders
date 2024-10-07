import { useState } from 'react';
import { useRouter } from 'next/router';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const response = await fetch('/api/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }), // Przesyłamy tylko hasło
    });
  
    const data = await response.json();
    if (data.success && data.role === "AdminPage") {
      router.push('/admin'); // Przekieruj do panelu admina
    } else {
      setError('Nieprawidłowe hasło!');
    }
  };
  

  return (
    <div>
      <h1>Logowanie administratora</h1>
      <form onSubmit={handleAdminLogin}>
        <input
          type="password"
          placeholder="Wpisz hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Zaloguj się</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AdminLoginPage;
