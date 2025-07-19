import Product from './components/Product';
import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="App">
      <h1>React E-Ticaret</h1>
      <Product products={products} />
    </div>
  );
}

export default App;
