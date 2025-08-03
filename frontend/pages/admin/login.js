import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../pages/styles/AdminLogin.module.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === 'admin123') {
      localStorage.setItem('adminToken', 'true');
      router.push('/admin');
    } else {
      alert('Hatalı şifre!');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Girişi</h2>
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>
        Giriş Yap
      </button>
    </div>
  );
}
