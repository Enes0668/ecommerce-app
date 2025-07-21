import { useEffect, useState } from 'react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchCartItems();
        console.log('LocalStorage userId:', localStorage.getItem('userId'));
    }, []);

    const fetchCartItems = () => {
        const userId = localStorage.getItem('userId');
        fetch(`http://localhost:5000/api/cart/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                setCartItems(data);
                calculateTotalPrice(data);
            });
    };

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

    return (
        <div>
            <h1>Sepetim</h1>
            
            {cartItems.length === 0 ? (
                <p>Sepetiniz boş.</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item._id}>
                        <h3>{item.name}</h3>
                        <p>Fiyat: {item.price}₺</p>
                        <p>Adet: {item.quantity}</p>
                        <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                        <button onClick={() => handleDelete(item._id)}>Sil</button>
                    </div>
                ))
            )}
            <h2>Toplam: {totalPrice} ₺</h2>
        </div>
    );
}
