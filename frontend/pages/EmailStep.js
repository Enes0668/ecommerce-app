import React, { useState } from 'react';

export default function EmailStep({ onNext }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    const res = await fetch('http://localhost:5000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      onNext(email);
    } else {
      setMessage(data.message);
    }
  };
  
  return (
    <div>
      <h2>Şifre Sıfırlama</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email giriniz"
      />
      <button onClick={handleSendOtp}>Kodu Gönder</button>
      <p>{message}</p>
    </div>
  );
}
