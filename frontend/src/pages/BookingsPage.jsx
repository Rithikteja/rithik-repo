import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getSessionUser } from "../api";
import AppShell from "../components/AppShell";
import AnimatedPage from "../components/AnimatedPage";

export default function BookingsPage() {
  const user = getSessionUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  async function loadBookings() {
    try {
      const data = await api(`/api/reservations/user/${user.userId}`);
      setBookings(data || []);
    } catch (e) {
      setMessage(e.message);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function cancelBooking(id) {
    try {
      await api(`/api/reservations/${id}/cancel`, { method: "POST" });
      await loadBookings();
    } catch (e) {
      setMessage(e.message);
    }
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <AppShell title="My Bookings" subtitle="Manage, pay, and track your reservations.">
      <AnimatedPage>
        <section className="panel">
          <div className="filters">
            {["all", "ACTIVE", "COMPLETED", "CANCELLED"].map((f) => (
              <button className={`pill ${filter === f ? "active" : ""}`} key={f} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          {message ? <p className="inline-message">{message}</p> : null}
        </section>

        <section className="panel stack">
          {filtered.length === 0 ? <p className="empty">No bookings found.</p> : filtered.map((b) => (
            <article className="booking-card" key={b.id}>
              <h3>Spot #{b.spotId}</h3>
              <p>Status: {b.status}</p>
              <p>Payment: {b.paymentStatus || "PENDING"}</p>
              <p>Total: ${Number(b.totalPrice || 0).toFixed(2)}</p>
              <div className="actions">
                {b.status === "ACTIVE" ? <button className="btn-primary" onClick={() => navigate(`/payment/${b.id}`)}>Pay Now</button> : null}
                {b.status === "ACTIVE" ? <button className="btn-ghost" onClick={() => cancelBooking(b.id)}>Cancel</button> : null}
              </div>
            </article>
          ))}
        </section>
      </AnimatedPage>
    </AppShell>
  );
}
