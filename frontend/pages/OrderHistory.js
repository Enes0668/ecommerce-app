import { useEffect, useState } from 'react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Siparişler alınamadı:', err));
  }, [userId]);

  return (
    <div>
      <h1>Sipariş Geçmişi</h1>
      {orders.length === 0 ? (
        <p>Henüz siparişiniz yok.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <p><strong>İsim:</strong> {name}</p>
            <p><strong>Sipariş ID:</strong> {order._id}</p>
            <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Toplam Fiyat:</strong> {order.totalPrice} ₺</p>
            <p><strong>Durum:</strong> {order.status}</p>
            <div>
              <strong>Ürünler:</strong>
              <ul>
                {order.items.map(item => (
                  <li key={item.productId}>
                    {item.name} - {item.quantity} x {item.price} ₺
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
