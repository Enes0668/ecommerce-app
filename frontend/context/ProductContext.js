import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProducts = () => {
    fetch(`${API_URL}/api/products`)
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
