import { useState } from "react";
import { useRouter } from "next/router"; // <-- useRouter import ettik
import styles from "./styles/Register.module.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function calculatePasswordStrength(password) {
  let score = 0;
  if (!password) return score;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[\W_]/.test(password)) score += 1;

  return score;
}

export default function Register() {
  const router = useRouter(); // <-- router hook

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
      const res = await fetch(`${API_URL}/api/auth/register`, {
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

        // Kayıt başarılıysa index sayfasına yönlendir
        router.push("/"); // <-- yönlendirme burada
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
    <div className={styles.container}>
      <h2 className={styles.title}>Kayıt Ol</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Kullanıcı adı"
          value={formData.username}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <p className={styles.passwordHint}>
          Şifre en az 8 karakter olmalı, büyük harf, küçük harf, rakam ve özel
          karakter içermelidir.
        </p>

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Şifre tekrar"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <div className={styles.strengthBar}>
          <div
            className={styles.strengthBarFill}
            style={{
              width: `${(passwordStrength / 5) * 100}%`,
              backgroundColor: getProgressColor(),
            }}
          />
        </div>

        <input
          type="text"
          name="address"
          placeholder="Adres"
          value={formData.address}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.submitButton}>
          Kayıt Ol
        </button>
      </form>
      <p className={styles.message} style={{ color: messageColor }}>
        {message}
      </p>
    </div>
  );
}
