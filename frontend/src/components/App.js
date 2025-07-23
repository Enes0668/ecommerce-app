import Product from './components/Product';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  <Router>
  <Routes>
    {/* diğer route'lar */}
    <Route path="/orders" element={<OrderHistory />} />
  </Routes>
</Router>

  return (
    <div className="App">
      <h1>React E-Ticaret</h1>
      <Product products={products} />
    </div>
  );
}

export default App;
