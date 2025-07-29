import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')  // Backend'de populate yapmayı unutma (category)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Fiyat: {product.price} ₺</p>
          <p>Kategori: {product.category ? product.category.name : 'Kategori yok'}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
