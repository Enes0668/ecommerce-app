import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
    } else {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.error('Kategori alınamadı'));
  }, []);

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
    <div className="container my-4">
      <h1 className="mb-4 text-center">Ürünler</h1>

      {message && (
        <div className="alert alert-info text-center" role="alert">
          {message}
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="category" className="form-label mb-0">
            Kategori Seç:
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="form-select"
            style={{ minWidth: '200px' }}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <Link href="/cart" className="btn btn-primary">
            Sepetim
          </Link>
          <Link href="/OrderHistory" className="btn btn-secondary">
            Sipariş Geçmişi
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => (
          <div key={product._id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <Link href={`/product/${product._id}`} className="card-title h5 text-decoration-none">
                  {product.name}
                </Link>
                <p className="card-text mb-1">{product.price}₺</p>
                <p className="text-muted mb-3">
                  Kategori: {product.category?.name || 'Kategori yok'}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-outline-primary mt-auto"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
