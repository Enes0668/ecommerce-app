import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Giriş başarısız.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);

      router.push('/');
    } catch (error) {
      console.error('Login hatası:', error);
      setErrorMessage('Sunucu hatası, lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Giriş Yap</h1>

      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />

      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />

      <button onClick={handleLogin} className={styles.button}>
        Giriş Yap
      </button>

      <p className={styles.linkText}>
        Şifrenizi mi unuttunuz?{' '}
        <button onClick={() => router.push('/forgot-password')} className={styles.linkButton}>
          Şifremi unuttum
        </button>
      </p>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
