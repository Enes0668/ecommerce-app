// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Basit parola kontrolü (örnek)
    if (password === 'admin123') {
      localStorage.setItem('adminToken', 'true');
      router.push('/admin'); // Admin paneline yönlendir
    } else {
      alert('Hatalı şifre!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Girişi</h2>
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} style={{ marginLeft: '1rem' }}>
        Giriş Yap
      </button>
    </div>
  );
}
