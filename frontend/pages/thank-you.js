import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    // Eğer kullanıcı bu sayfaya ödeme yapmadan gelirse, yönlendirme yapılabilir
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (cartItems.length > 0) {
      // Sepette hâlâ ürün varsa, bu sayfaya ödeme olmadan geldiği varsayılır
      router.push('/cart');
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Teşekkürler!</h1>
      <p>Siparişiniz başarıyla alındı. En kısa sürede işleme alınacaktır.</p>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/')}
      >
        Ana Sayfaya Dön
      </button>
    </div>
  );
}
