import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api, setSessionUser } from "../api";
import AnimatedPage from "../components/AnimatedPage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMessage("Enter username and password.");
      return;
    }

    setBusy(true);
    setMessage("Signing in...");

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      if (data?.success && data?.user) {
        setSessionUser(data.user);
        navigate("/dashboard");
        return;
      }

      setMessage(data?.message || "Invalid credentials.");
    } catch (error) {
      setMessage(error.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatedPage>
      <div className="auth-layout">
        <motion.section className="auth-card" initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
          <h1>Welcome back</h1>
          <p>Park smarter. Move faster. Stress less.</p>
          <form onSubmit={onSubmit}>
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
            <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Signing In..." : "Sign In"}</button>
            {message ? <div className="inline-message">{message}</div> : null}
          </form>
          <p className="helper-link">New here? <Link to="/register">Create account</Link></p>
        </motion.section>
      </div>
    </AnimatedPage>
  );
}
