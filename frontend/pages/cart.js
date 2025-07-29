import { useEffect, useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/api/cart/user/${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setCartItems(data);
        calculateTotalPrice(data);
      } else {
        console.error("Sunucudan gelen veri dizi değil:", data);
      }
    } catch (error) {
      console.error("Sepet verileri alınamadı:", error);
    }
  };

  const calculateTotalPrice = (items) => {
  const total = items.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  setTotalPrice(total);
};

  const handleDelete = async (itemId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      fetchCartItems();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      fetchCartItems();
    } catch (error) {
      console.error('Adet güncelleme hatası:', error);
    }
  };

  const clearCart = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/api/cart/clear/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      alert(data.message);
      fetchCartItems();
    } catch (error) {
      console.error('Sepeti temizleme hatası:', error);
      alert('Sepeti temizlerken bir hata oluştu.');
    }
  };

  const handleCheckout = async () => {
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Siparişiniz başarıyla oluşturuldu!');
        fetchCartItems();
      } else {
        alert(data.message || 'Sipariş oluşturulamadı.');
      }
    } catch (error) {
      console.error('Sipariş hatası:', error);
      alert('Sunucu hatası oluştu.');
    }
  };

  return (
    <div>
      <h1>Sepetim</h1>

      {!Array.isArray(cartItems) || cartItems.length === 0 ? (
  <p>Sepetiniz boş.</p>
) : (
  cartItems.map((item) => (
    <div key={item._id}>
      <h3>{item.productId?.name}</h3>
      <p>Fiyat: {item.productId?.price}₺</p>
      <p>Adet: {item.quantity}</p>
      <p>Kategori: {item.productId?.category?.name}</p>
      <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
      <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
      <button onClick={() => handleDelete(item._id)}>Sil</button>
    </div>
  ))
)}

      <h2>Toplam: {totalPrice} ₺</h2>
      <button onClick={clearCart}>Sepeti Temizle</button>
      <button onClick={handleCheckout}>Siparişi Tamamla</button>
    </div>
  );
}
