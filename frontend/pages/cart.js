import { useEffect, useState } from 'react';
import styles from './styles/Cart.module.css';
import { useRouter } from 'next/router';  // sayfanın üst kısmına ekle

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
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
    localStorage.setItem('totalPrice', totalPrice);
    router.push('/payment');
  };

  return (
    <div className={styles.container}>
      <h1>Sepetim</h1>

      {!Array.isArray(cartItems) || cartItems.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className={styles.cartItem}>
            <div className={styles.itemInfo}>
              <h3>{item.productId?.name}</h3>
              <p>Fiyat: {item.productId?.price}₺</p>
              <p>Kategori: {item.productId?.category?.name || '-'}</p>
            </div>

            <div className={styles.itemActions}>
              <div className={styles.quantity}>
                <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
              </div>
              <button className={styles.deleteBtn} onClick={() => handleDelete(item._id)}>Sil</button>
            </div>
          </div>
        ))
      )}

      <h2 className={styles.total}>Toplam: {totalPrice} ₺</h2>

      <div className={styles.actions}>
        <button onClick={clearCart} className="btn btn-outline-danger">Sepeti Temizle</button>
        <button onClick={handleCheckout} className="btn btn-success">Siparişi Tamamla</button>
      </div>
    </div>
  );
}

