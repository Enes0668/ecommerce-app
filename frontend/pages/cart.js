import { useEffect, useState } from 'react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        fetch(`http://localhost:5000/api/cart/user/${userId}`)
            .then(res => res.json())
            .then(data => {
            setCartItems(data);
            });
            console.log('LocalStorage userId:', userId);
    }, []);

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
                    </div>
                ))
            )}
        </div>
    );
}
