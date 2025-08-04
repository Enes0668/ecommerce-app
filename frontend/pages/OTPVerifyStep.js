import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/OTPVerifyStep.module.css';

export default function OTPVerifyStep() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const email = typeof window !== 'undefined' ? localStorage.getItem('email') : '';

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/ResetPasswordStep');
      } else {
        alert(data.message || 'Kod yanlış veya süresi dolmuş.');
      }
    } catch (err) {
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>OTP Doğrulama</h1>
      <form onSubmit={handleVerify} className={styles.form}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="OTP kodunu girin"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Doğrula
        </button>
      </form>
    </div>
  );
}
