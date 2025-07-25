import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setMessage('Kayıt başarılı!');
        setFormData({ username: "", email: "", password: "", address: "", phone: "" });
      } else {
        setMessage('Kayıt olurken hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Sunucu hatası.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 50 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
