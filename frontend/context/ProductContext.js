import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => console.error('Ürünler alınamadı'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, fetchProducts, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
