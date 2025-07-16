import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) return <h2>Sepetin boş.</h2>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sepetim</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item._id}>
            {item.name} - {item.price}₺ x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
