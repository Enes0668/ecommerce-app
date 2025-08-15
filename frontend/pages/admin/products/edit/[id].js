import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../../styles/EditProductPage.module.css';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Ürün yüklenemedi:', err));
  }, [id]);

  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert('Ürün güncellendi!');
      router.push('/admin');
    } else {
      alert('Güncelleme başarısız!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ürünü Güncelle</h1>
      <form className={styles.formWrapper} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>İsim:</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className={styles.input}
            type="text"
          />
        </div>
        <div>
          <label className={styles.label}>Fiyat:</label>
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>Açıklama:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
        </div>
        <div>
          <label className={styles.label}>Resim URL:</label>
          <input
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
}
