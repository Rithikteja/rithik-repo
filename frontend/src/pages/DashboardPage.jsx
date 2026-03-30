import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api, getSessionUser } from "../api";
import AppShell from "../components/AppShell";
import AnimatedPage from "../components/AnimatedPage";

export default function DashboardPage() {
  const user = getSessionUser();
  const [spots, setSpots] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [availableSpots, userBookings] = await Promise.all([
          api("/api/parking/spots/available"),
          api(`/api/reservations/user/${user.userId}`)
        ]);
        setSpots(availableSpots || []);
        setBookings(userBookings || []);
      } catch (e) {
        console.error(e);
      }
    }

    load();
  }, [user.userId]);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status === "ACTIVE").length;
    const total = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
    return { active, total };
  }, [bookings]);

  return (
    <AppShell title={`Hey ${user.username || "Driver"}`} subtitle="Your parking activity at a glance.">
      <AnimatedPage>
        <section className="grid-cards">
          <motion.article className="stat-card" whileHover={{ y: -4 }}>
            <h3>{spots.length}</h3>
            <p>Available Spots</p>
          </motion.article>
          <motion.article className="stat-card" whileHover={{ y: -4 }}>
            <h3>{stats.active}</h3>
            <p>Active Bookings</p>
          </motion.article>
          <motion.article className="stat-card" whileHover={{ y: -4 }}>
            <h3>${stats.total.toFixed(2)}</h3>
            <p>Total Spent</p>
          </motion.article>
        </section>

        <section className="panel">
          <h2>Recent bookings</h2>
          {bookings.length === 0 ? <p className="empty">No bookings yet.</p> : (
            <div className="stack">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="list-row">
                  <strong>Spot #{b.spotId}</strong>
                  <span>{b.status}</span>
                  <span>${Number(b.totalPrice || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </AnimatedPage>
    </AppShell>
  );
}
