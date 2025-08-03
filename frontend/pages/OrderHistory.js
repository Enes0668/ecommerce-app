import { useEffect, useState } from 'react';
import styles from './styles/OrderHistory.module.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOrders(data);
      })
      .catch(err => console.error('Siparişler alınamadı:', err));
  }, [userId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sipariş Geçmişi</h1>
      {orders.length === 0 ? (
        <p className={styles.emptyText}>Henüz siparişiniz yok.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className={styles.orderCard}>
            <p className={styles.orderInfo}><strong>Sipariş ID:</strong> {order._id}</p>
            <p className={styles.orderInfo}><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p className={styles.orderInfo}><strong>Toplam Fiyat:</strong> {order.totalPrice} ₺</p>
            <p className={styles.orderInfo}><strong>Durum:</strong> {order.status}</p>
            <div>
              <strong>Ürünler:</strong>
              <ul className={styles.orderItems}>
                {order.items.map((item, index) => (
                  <li key={index} className={styles.item}>
                    {item.productId
                      ? `${item.productId.name} - ${item.quantity} x ${item.productId.price} ₺`
                      : 'Ürün silinmiş veya bulunamadı.'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
