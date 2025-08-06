// routes/payment.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
// Stripe Public Key (TEST ortamı için)
const stripePromise = loadStripe('pk_test_51Rsm9CKWO2ntlXOyk2qOPobnBwesO68yo1IWWX1SmKqmmj2XqSbhDx5zifCOtxEfxUVfKoBJmf4vsWZkTO0sR59T005oR1MYpq');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const price = localStorage.getItem('totalPrice');
    if (price) setTotalPrice(Number(price));
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);

    const fetchPaymentIntent = async () => {
      const res = await fetch('http://localhost:5000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
      setAmount(data.amount / 100); // Kuruş -> TL
    };

    fetchPaymentIntent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError('Ödeme sistemi henüz hazır değil.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (paymentResult.error) {
      setError(paymentResult.error.message);
      setLoading(false);
      return;
    }

    if (paymentResult.paymentIntent.status === 'succeeded') {
      const userId = localStorage.getItem('userId');

      const orderRes = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: cartItems })
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        alert('Siparişiniz başarıyla oluşturuldu!');
        localStorage.removeItem('cartItems');
        router.push('/thank-you');
      } else {
        setError(orderData.message || 'Sipariş oluşturulamadı.');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Toplam Tutar: ₺{totalPrice}</h2>

      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.productId?.name || 'Ürün'} - ₺{item.productId?.price}
          </li>
        ))}
      </ul>

      <div style={{ margin: '20px 0' }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Ödeme yapılıyor...' : 'Ödemeyi Tamamla'}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
