// pages/admin/products/edit/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Ürün yüklenemedi:', err));
  }, [id]);

  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert('Ürün güncellendi!');
      router.push('/admin');
    } else {
      alert('Güncelleme başarısız!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ürünü Güncelle</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>İsim:</label>
          <input name="name" value={product.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Fiyat:</label>
          <input name="price" type="number" value={product.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Açıklama:</label>
          <textarea name="description" value={product.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Resim URL:</label>
          <input name="imageUrl" value={product.imageUrl} onChange={handleChange} required />
        </div>
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
}
