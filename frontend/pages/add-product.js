import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/AddProduct.module.css';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => {
        console.error('Kategori yüklenirken hata:', err);
        setMessage('Kategori verileri alınamadı.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          description,
          category: selectedCategory,
          imageUrl
        }),
      });

      if (res.ok) {
        setMessage('✅ Ürün başarıyla eklendi!');
        setName('');
        setPrice('');
        setDescription('');
        setSelectedCategory('');
        setImageUrl('');
      } else {
        const data = await res.json();
        setMessage(`❌ Hata: ${data.message || 'Ürün eklenemedi.'}`);
      }
    } catch (error) {
      console.error('Sunucu hatası:', error);
      setMessage('❌ Sunucu hatası!');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ürün Ekle</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>İsim:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Fiyat:</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Açıklama:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Kategori:</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Kategori seçiniz</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Resim URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            required
          />
        </div>

        {imageUrl && (
          <div className={styles.imagePreview}>
            <img src={imageUrl} alt="Önizleme" />
          </div>
        )}

        <button type="submit">Ürün Ekle</button>
      </form>

      {message && (
        <p
          className={`${styles.message} ${message.startsWith('✅') ? styles.success : ''}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
