import { useState } from 'react';
import styles from '../pages/styles/AddCategory.module.css';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage('Kategori başarıyla eklendi!');
      setName('');
    } else {
      setMessage('Kategori eklenirken hata oluştu!');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kategori Ekle</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Kategori Adı:</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.btn}>Ekle</button>
      </form>
      {message && (
        <p className={`${styles.message} ${message.includes('başarıyla') ? styles.success : ''}`}>
          {message}
        </p>
      )}
    </div>
  );
}
