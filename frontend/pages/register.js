import { useState } from "react";

function calculatePasswordStrength(password) {
  let score = 0;
  if (!password) return score;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[\W_]/.test(password)) score += 1;

  return score; // 0 - 5 arası puan
}

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("black");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getProgressColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "red";
      case 2:
      case 3:
        return "orange";
      case 4:
        return "yellowgreen";
      case 5:
        return "green";
      default:
        return "transparent";
    }
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(formData.password)) {
      setMessage(
        "Şifre en az 8 karakter olmalı, büyük harf, küçük harf, rakam ve özel karakter içermeli."
      );
      setMessageColor("red");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Şifreler uyuşmuyor.");
      setMessageColor("red");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Kayıt başarılı!");
        setMessageColor("green");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          address: "",
          phone: "",
        });
      } else {
        setMessage(data.message || "Kayıt olurken hata oluştu.");
        setMessageColor("red");
      }
    } catch (err) {
      console.error(err);
      setMessage("Sunucu hatası.");
      setMessageColor("red");
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
        {/* Şifre güç göstergesi */}
        <div
          style={{
            height: 10,
            backgroundColor: "#ddd",
            borderRadius: 5,
            marginBottom: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(passwordStrength / 5) * 100}%`,
              height: "100%",
              backgroundColor: getProgressColor(),
              transition: "width 0.3s",
            }}
          />
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p style={{ color: messageColor }}>{message}</p>
    </div>
  );
}
