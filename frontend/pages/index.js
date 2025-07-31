import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');

  // LocalStorage userId çek
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  // Kategorileri getir
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.error('Kategori alınamadı'));
  }, []);

  // Ürünleri getir (kategori seçimine göre)
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

  // Sepete ekleme işlemi
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
          category: product.category
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
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ürünler</h1>

      {message && (
        <div style={{ marginBottom: '1rem', color: 'red' }}>
          {message}
        </div>
      )}

      {/* Kategori filtreleme dropdown */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="category">Kategori Seç: </label>
        <select
          id="category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ürünler listesi */}
      <ul>
        {products.map((product) => {
  console.log(product.category); // sadece log için
  return (
    <li key={product._id} style={{ marginBottom: '1rem' }}>
      <Link href={`/product/${product._id}`}>
        <strong>{product.name}</strong> - {product.price}₺
      </Link>
      <p>Kategori: {product.category?.name || 'Kategori yok'}</p>
      <button
        onClick={() => handleAddToCart(product)}
        style={{ marginTop: '0.5rem', cursor: 'pointer' }}
      >
        Sepete Ekle
      </button>
      <hr />
    </li>
  );
})}
      </ul>

      <Link href="/cart">Sepetim</Link>
      <br />
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Çıkış Yap
      </button>
      <br />
      <Link href="/OrderHistory">Sipariş Geçmişi</Link>
    </div>
  );
}
