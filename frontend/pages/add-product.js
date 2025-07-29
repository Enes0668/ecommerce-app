import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // yeni

  useEffect(() => {
  axios.get('http://localhost:5000/api/categories')
    .then(res => {
      console.log('Kategori verisi:', res.data); // Burayı ekle
      setCategories(res.data);
    })
    .catch(err => console.error('Kategori yüklenirken hata:', err));
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // selectedCategory id’sini backend’e gönderiyoruz
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
      name, 
      price: Number(price), 
      description, 
      category: selectedCategory  // eklendi
      }),
    });

    if (res.ok) {
      setMessage('Ürün başarıyla eklendi!');
      setName('');
      setPrice('');
      setDescription('');
      setSelectedCategory(''); // seçimi sıfırla
    } else {
      setMessage('Ürün eklenirken hata oluştu!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ürün Ekle</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>İsim:</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Fiyat:</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Açıklama:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>Kategori:</label>
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)} 
            required
          >
            <option value="">Kategori seçiniz</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button type="submit">Ekle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
