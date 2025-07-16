import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    
    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    if (!product) return <div>Yükleniyor...</div>;
    
   <button onClick={() => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Ürün sepete eklendi!');
     }}>Sepete Ekle</button>
 

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{product.name}</h1>
            <p>Fiyat: {product.price}₺</p>
            <p>{product.description}</p>
            <img src={product.image} width="300" />
        </div>
    );
}
