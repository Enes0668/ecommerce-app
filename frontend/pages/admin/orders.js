import { useEffect, useState } from 'react';
import styles from '../../pages/styles/AdminOrders.module.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);      // Yükleniyor durumu eklendi
  const [error, setError] = useState(null);          // Hata durumu eklendi
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/orders/all`)
      .then(res => {
        if (!res.ok) throw new Error('Sunucu hatası');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Siparişler alınamadı:', err);
        setError('Siparişler alınamadı. Lütfen tekrar deneyin.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className={styles.message}>Yükleniyor...</p>;
  }

  if (error) {
    return <p className={`${styles.message} ${styles.error}`}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tüm Siparişler</h1>

      {orders.length === 0 ? (
        <p className={styles.noOrders}>Henüz sipariş bulunmamaktadır.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <p>
              <strong>Kullanıcı Adı:</strong>{' '}
              {order.userId ? `${order.userId.username} (${order.userId.email})` : 'Bilinmeyen kullanıcı'}
            </p>
            <p><strong>Kullanıcı ID:</strong> {order.userId?._id || 'Yok'}</p>
            <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Toplam Fiyat:</strong> {order.totalPrice} ₺</p>

            <ul className={styles.itemList}>
              {order.items?.map((item, index) => (
                <li key={index} className={styles.item}>
                  {item.productId ? (
                    <>
                      {item.productId.name} - <strong>{item.quantity}</strong> adet - {item.productId.price} ₺
                    </>
                  ) : (
                    <>
                      (Ürün silinmiş) - <strong>{item.quantity}</strong> adet
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
