import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function OTPVerifyStep() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/reset-password');
      } else {
        alert('Kod yanlış veya süresi dolmuş.');
      }
    } catch (err) {
      alert('Bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP kodunu girin"
        required
      />
      <button type="submit">Doğrula</button>
    </form>
  );
}
