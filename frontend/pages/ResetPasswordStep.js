import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './styles/ResetPasswordStep.module.css';

export default function ResetPasswordStep({ otp }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  const handleReset = async () => {
    if (!email) {
      setMessage("Email bilgisi alınamadı.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      console.log(response.data);
      setMessage('Şifreniz başarıyla güncellendi.');
      setTimeout(() => router.push("/login"), 1500); // kısa gecikme ile yönlendirme
    } catch (err) {
      console.error("Hata:", err.response?.data || err.message);
      setMessage('Şifre güncellenemedi.');
    }
  };

  return (
  <div className={styles.container}>
    <h2 className={styles.heading}>Yeni Şifrenizi Girin</h2>
    <form onSubmit={(e) => { e.preventDefault(); handleReset(); }} className={styles.form}>
      <input
        type="password"
        placeholder="Yeni şifre"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.button}>
        Şifreyi Güncelle
      </button>
    </form>
    {message && <p className={styles.message}>{message}</p>}
  </div>
);
}
