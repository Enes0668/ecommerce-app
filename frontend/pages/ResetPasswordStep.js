import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPasswordStep({ otp }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(null); // email state
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
      router.push("/login");
    } catch (err) {
      console.error("Hata:", err.response?.data || err.message);
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
