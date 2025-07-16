import { useState } from 'react';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price: Number(price), description }),
    });

    if (res.ok) {
      setMessage('Ürün başarıyla eklendi!');
      setName('');
      setPrice('');
      setDescription('');
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
        <button type="submit">Ekle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
