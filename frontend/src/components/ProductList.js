import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Kategorileri çek
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Kategori alınamadı:', err));
  }, []);

  // Ürünleri çek (kategoriye göre filtreleme)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategoryId
          ? `http://localhost:5000/api/products?category=${selectedCategoryId}`
          : `http://localhost:5000/api/products`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error('Ürünler alınamadı:', err);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  return (
    <div>
      <h2>Ürün Listesi</h2>

      <label>Kategori Seç:</label>
      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">Tüm Kategoriler</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <h3>{product.name}</h3>
            <p>Fiyat: {product.price} ₺</p>
            <p>Kategori: {product.category ? product.category.name : 'Kategori yok'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
