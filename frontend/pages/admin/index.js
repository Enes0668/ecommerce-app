import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../pages/styles/AdminPanel.module.css';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Bu sayfayı görüntülemek için giriş yapmalısınız.');
      router.push('/admin/login');
      return;
    }

    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ürünler yüklenemedi:', err);
        setLoading(false);
      });
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });

      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Silme işlemi başarısız oldu.');
    }
  };

  if (loading) return <div className={styles.loading}>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Paneli</h1>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => router.push('/admin/products/add')}
        >
          + Yeni Ürün Ekle
        </button>
        <button
          className={styles.button}
          onClick={() => router.push('/admin/orders')}
        >
          Siparişler
        </button>
        <button
          className={styles.button}
          onClick={() => router.push('/admin/users')}
        >
          Kullanıcılar
        </button>
        <button
          className={styles.button}
          onClick={() => router.push('/AddCategory')}
        >
          + Kategori ekle
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
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
                <td className={styles.actionButtons}>
                  <button
                    onClick={() =>
                      router.push(`/admin/products/edit/${product._id}`)
                    }
                  >
                    Düzenle
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(product._id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
