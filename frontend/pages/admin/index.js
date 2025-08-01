// pages/admin/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Oturum kontrolü örneği (token varsa vs.)
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Bu sayfayı görüntülemek için giriş yapmalısınız.');
      router.push('/admin/login');
      return;
    }

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ürünler yüklenemedi:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Silme işlemi başarısız oldu.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Paneli</h1>
      <button onClick={() => router.push('/admin/products/add')}>+ Yeni Ürün Ekle</button>
      <table border="1" cellPadding="10" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>İsim</th>
            <th>Fiyat</th>
            <th>Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price} ₺</td>
              <td>
                <button onClick={() => router.push(`/admin/products/edit/${product._id}`)}>Düzenle</button>
                <button onClick={() => handleDelete(product._id)} style={{ marginLeft: '1rem' }}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
