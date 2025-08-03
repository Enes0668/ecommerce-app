import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
import './styles/globals.css';
export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
