import { useState } from 'react';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage('Kategori başarıyla eklendi!');
      setName('');
    } else {
      setMessage('Kategori eklenirken hata oluştu!');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kategori Ekle</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kategori Adı:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ekle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
