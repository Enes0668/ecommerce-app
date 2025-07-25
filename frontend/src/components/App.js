import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../../pages/login';
import OrderHistory from '../../pages/OrderHistory';
import EmailStep from '../../pages/EmailStep';
import OTPVerifyStep from '../../pages/OTPVerifyStep';
import ResetPasswordStep from '../../pages/ResetPasswordStep';

function App() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/forgot-password"
          element={
            <EmailStep
              onNext={(e) => {
                setEmail(e);
                // React Router ile yönlendirme:
                window.history.pushState({}, '', '/verify-otp');
                // veya daha doğru: useNavigate kullanarak yönlendir
                // Fakat burası component değil, EmailStep içinde navigate kullan
              }}
            />
          }
        />

        <Route
          path="/verify-otp"
          element={
            <OTPVerifyStep
              email={email}
              onNext={(o) => {
                setOtp(o);
                window.history.pushState({}, '', '/reset-password');
              }}
            />
          }
        />

        <Route path="/reset-password" element={<ResetPasswordStep email={email} otp={otp} />} />

        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
