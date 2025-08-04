import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/ProductDetail.module.css';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Hata:', err);
        setLoading(false);
      });
  }, [id]);

  const sepeteEkle = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ürün sepete eklendi!');
  };

  if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
  if (!product) return <div className={styles.notFound}>Ürün bulunamadı</div>;

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>{product.price} ₺</p>
        <button className={styles.addButton} onClick={sepeteEkle}>Sepete Ekle</button>
      </div>
    </div>
  );
}
