// src/components/ResetPasswordStep.js
import React, { useState } from 'react';
import axios from 'axios';

export default function ResetPasswordStep({ email, otp }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      setMessage('Şifreniz başarıyla güncellendi.');
    } catch (err) {
      setMessage('Şifre güncellenemedi.');
    }
  };

  return (
    <div>
      <h2>Yeni Şifrenizi Girin</h2>
      <input
        type="password"
        placeholder="Yeni şifre"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Şifreyi Güncelle</button>
      <p>{message}</p>
    </div>
  );
}
