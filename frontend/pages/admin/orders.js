import { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/all')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Siparişler alınamadı:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tüm Siparişler</h1>

      {orders.map((order) => (
        <div key={order._id} style={{ marginBottom: '2rem', border: '1px solid gray', padding: '1rem' }}>
          <p>
            <strong>Kullanıcı Adı:</strong> {order.userId ? `${order.userId.username} (${order.userId.email})` : 'Bilinmeyen kullanıcı'}
          </p>
          <p><strong>Kullanıcı ID:</strong> {order.userId?._id || 'Yok'}</p>
          <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Toplam Fiyat:</strong> {order.totalPrice} ₺</p>
          <ul>
            {order.items?.map((item, index) => (
              <li key={index}>
                {item.productId ? (
                  <>
                    {item.productId.name} - {item.quantity} adet - {item.productId.price}₺
                  </>
                ) : (
                  <>
                    (Ürün silinmiş) - {item.quantity} adet
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
