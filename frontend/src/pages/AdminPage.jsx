import { useEffect, useState } from "react";
import { api } from "../api";
import AppShell from "../components/AppShell";
import AnimatedPage from "../components/AnimatedPage";

export default function AdminPage() {
  const [spots, setSpots] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tab, setTab] = useState("spots");
  const [message, setMessage] = useState("");

  async function loadAll() {
    try {
      const [s, u, r] = await Promise.all([
        api("/api/parking/spots"),
        api("/api/parking/users"),
        api("/api/parking/reservations")
      ]);
      setSpots(s || []);
      setUsers(u || []);
      setReservations(r || []);
    } catch (e) {
      setMessage(e.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <AppShell title="Admin Control" subtitle="Operational visibility with one dashboard.">
      <AnimatedPage>
        <section className="panel">
          <div className="filters">
            {["spots", "users", "reservations"].map((t) => (
              <button key={t} className={`pill ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          {message ? <p className="inline-message">{message}</p> : null}
        </section>

        <section className="panel stack">
          {tab === "spots" && spots.map((spot) => (
            <div className="list-row" key={spot.id}>
              <strong>Spot #{spot.spotNumber}</strong>
              <span>{spot.location}</span>
              <span>{spot.reserved ? "Reserved" : "Available"}</span>
            </div>
          ))}

          {tab === "users" && users.map((u) => (
            <div className="list-row" key={u.id}>
              <strong>{u.username}</strong>
              <span>{u.email}</span>
              <span>{u.phone || "-"}</span>
            </div>
          ))}

          {tab === "reservations" && reservations.map((r) => (
            <div className="list-row" key={r.id}>
              <strong>#{r.id}</strong>
              <span>Spot #{r.spotId}</span>
              <span>{r.status}</span>
            </div>
          ))}
        </section>
      </AnimatedPage>
    </AppShell>
  );
}
