import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryFilter = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Kategori alınamadı:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <select onChange={(e) => onSelectCategory(e.target.value)}>
        <option value="">Tüm Kategoriler</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
