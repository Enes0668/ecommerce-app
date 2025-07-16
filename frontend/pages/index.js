import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ürünler</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <Link href={`/product/${product._id}`}>
              <strong>{product.name}</strong> - {product.price}₺
            </Link>
            <button onClick={() => addToCart(product)} style={{ marginLeft: '1rem' }}>
              Sepete Ekle
            </button>
            <hr />
          </li>
        ))}
      </ul>
      <Link href="/cart">Sepetim</Link>
    </div>
  );
}
