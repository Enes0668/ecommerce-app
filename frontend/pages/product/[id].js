// pages/products/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Hata:', err);
        setLoading(false);
      });
  }, [id]);

  const sepeteEkle = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ürün sepete eklendi!');
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!product) return <div>Ürün bulunamadı</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>{product.price} ₺</strong></p>
      <img src={product.imageUrl} alt={product.name} width="300" />
    </div>
  );
}
