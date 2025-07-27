import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // Emaili localStorage'a kaydet
      localStorage.setItem('email', email);

      // OTP doğrulama sayfasına yönlendir
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
    <div style={{ padding: '2rem' }}>
      <h1>Şifremi Unuttum</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email adresinizi girin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Gönder
        </button>
      </form>
    </div>
  );
}
