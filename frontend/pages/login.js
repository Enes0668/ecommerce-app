import React, { useState } from 'react';
import { useRouter } from 'next/router';

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

      // Başarılı girişte bilgileri localStorage'a kaydet
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);

      // Ana sayfaya yönlendir
      router.push('/');
    } catch (error) {
      console.error('Login hatası:', error);
      setErrorMessage('Sunucu hatası, lütfen tekrar deneyin.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Giriş Yap</h1>

      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
      />

      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
      />

      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        Giriş Yap
      </button>

      <p style={{ marginTop: '10px' }}>
        Şifrenizi mi unuttunuz?{' '}
        <button
          onClick={() => router.push('/forgot-password')}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Şifremi unuttum
        </button>
      </p>

      {errorMessage && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</p>}
    </div>
  );
}
