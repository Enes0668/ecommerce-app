import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
