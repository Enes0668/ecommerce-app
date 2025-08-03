import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Kullanıcılar alınamadı:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kullanıcı Listesi</h1>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>Email</th>
            <th>Adres</th>
            <th>Telefon</th>
            <th>Oluşturulma</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address || '-'}</td>
              <td>{user.phone || '-'}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
