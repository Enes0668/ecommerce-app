import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/ForgotPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        localStorage.setItem('email', email);
        router.push('/OTPVerifyStep');
      } else {
        alert('OTP gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Şifremi Unuttum</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email adresinizi girin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Gönder
        </button>
      </form>
    </div>
  );
}
