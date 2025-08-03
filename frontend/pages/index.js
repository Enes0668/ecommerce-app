import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // yönlendirme için

import styles from './styles/Home.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 🚨 Giriş yapılmamışsa login sayfasına yönlendir
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
    } else {
      setUserId(storedUserId);
    }
  }, []);

  // Kategorileri al
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.error('Kategori alınamadı'));
  }, []);

  // Ürünleri al
  useEffect(() => {
    let url = 'http://localhost:5000/api/products';
    if (selectedCategoryId) {
      url += `?category=${selectedCategoryId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setMessage('Ürünler yüklenemedi, sunucu çalışıyor mu kontrol et.'));
  }, [selectedCategoryId]);

  const handleAddToCart = async (product) => {
    if (!userId) {
      setMessage('Sepete eklemek için giriş yapmalısın.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sepete ekleme başarısız');
      }

      setMessage('Ürün sepete eklendi.');
    } catch (error) {
      console.error('Sepet hatası:', error);
      setMessage(error.message || 'Bilinmeyen bir hata oluştu');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <h1>Ürünler</h1>

      {message && <div className={styles.message}>{message}</div>}

        <div className={styles.linksContainer}>
          <div className={styles.filter}>
        <label htmlFor="category">Kategori Seç: </label>
        <select
          id="category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className={styles.select}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
          <Link href="/cart" className={styles.linkBtn}>Sepetim</Link> 
          <Link href="/OrderHistory" className={styles.linkBtn}>Sipariş Geçmişi</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>Çıkış Yap</button>
        </div>
      </div>

      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product._id} className={styles.productItem}>
            <Link href={`/product/${product._id}`} className={styles.productLink}>
              <strong>{product.name}</strong> - {product.price}₺
            </Link>
            <p>Kategori: {product.category?.name || 'Kategori yok'}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className={styles.addToCartBtn}
            >
              Sepete Ekle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
