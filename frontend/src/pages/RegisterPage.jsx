import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import AnimatedPage from "../components/AnimatedPage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage("Username, email and password are required.");
      return;
    }

    setBusy(true);
    setMessage("Creating account...");

    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password.trim(),
          role: "USER"
        })
      });

      if (data?.success) {
        setMessage("Account created. Redirecting to login...");
        setTimeout(() => navigate("/login"), 700);
        return;
      }

      setMessage(data?.message || "Registration failed.");
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatedPage>
      <div className="auth-layout">
        <motion.section className="auth-card" initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
          <h1>Create account</h1>
          <p>Build your parking routine in under a minute.</p>
          <form onSubmit={onSubmit}>
            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <label>Email</label>
            <input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Creating..." : "Create Account"}</button>
            {message ? <div className="inline-message">{message}</div> : null}
          </form>
          <p className="helper-link">Already have an account? <Link to="/login">Sign in</Link></p>
        </motion.section>
      </div>
    </AnimatedPage>
  );
}
