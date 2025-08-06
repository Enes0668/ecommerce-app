import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Buraya kendi publishable key'ini yaz
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>E-ticaret</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Elements stripe={stripePromise}>
        <ProductProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </ProductProvider>
      </Elements>
    </>
  );
}
