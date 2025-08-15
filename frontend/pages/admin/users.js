import { useEffect, useState } from 'react';
import styles from '../styles/AdminUsers.module.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Kullanıcılar alınamadı:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kullanıcı Listesi</h1>
      <table className={styles.table}>
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
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                Kullanıcı bulunamadı.
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td className={user.address ? '' : styles.emptyCell}>{user.address || '-'}</td>
                <td className={user.phone ? '' : styles.emptyCell}>{user.phone || '-'}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
