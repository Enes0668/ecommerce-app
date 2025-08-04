import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css'; // Yerel import yeterli

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>E-ticaret</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Eğer CDN kullanmak istersen aşağıdaki satırı açabilirsin, ancak genelde bootstrap'u local import etmek daha iyi */}
        {/* <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        /> */}
      </Head>

      <ProductProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </ProductProvider>
    </>
  );
}
