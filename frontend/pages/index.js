import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // SSR hatası almamak için client-side localStorage kullanımı
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setMessage('Ürünler yüklenemedi, sunucu çalışıyor mu kontrol et.'));
  }, []);

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

      <ul>
        {products.map((product) => (
          <li key={product._id} style={{ marginBottom: '1rem' }}>
            <Link href={`/product/${product._id}`}>
              <strong>{product.name}</strong> - {product.price}₺
            </Link>
            <button
              onClick={() => handleAddToCart(product)}
              style={{ marginLeft: '1rem', cursor: 'pointer' }}
            >
              Sepete Ekle
            </button>
            <hr />
          </li>
        ))}
      </ul>
      <Link href="/cart">Sepetim</Link>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Çıkış Yap
        </button>
      <Link href="/OrderHistory">Sipariş Geçmişi</Link>
    </div>
  );
}
