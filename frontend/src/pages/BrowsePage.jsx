import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api, getSessionUser } from "../api";
import AppShell from "../components/AppShell";
import AnimatedPage from "../components/AnimatedPage";

export default function BrowsePage() {
  const user = getSessionUser();
  const [spots, setSpots] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/parking/spots").then((data) => setSpots(data || [])).catch((e) => setMessage(e.message));
  }, []);

  const filtered = useMemo(() => {
    let data = [...spots];
    if (typeFilter) data = data.filter((s) => s.spotType === typeFilter);
    if (availabilityFilter === "available") data = data.filter((s) => !s.reserved);
    if (availabilityFilter === "reserved") data = data.filter((s) => s.reserved);
    return data;
  }, [spots, typeFilter, availabilityFilter]);

  async function reserve(spotId) {
    setMessage("Booking spot...");
    try {
      const now = new Date();
      const end = new Date(Date.now() + 60 * 60 * 1000);
      const data = await api("/api/reservations/create", {
        method: "POST",
        body: JSON.stringify({
          userId: user.userId,
          spotId,
          startTime: now.toISOString(),
          endTime: end.toISOString()
        })
      });
      setMessage(data?.message || "Reservation successful");
      const updated = await api("/api/parking/spots");
      setSpots(updated || []);
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <AppShell title="Browse Spots" subtitle="Reserve in one tap with real-time status.">
      <AnimatedPage>
        <section className="panel">
          <div className="filters">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All types</option>
              <option value="STANDARD">Standard</option>
              <option value="COMPACT">Compact</option>
              <option value="HANDICAP">Handicap</option>
            </select>
            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
              <option value="">All availability</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
          {message ? <p className="inline-message">{message}</p> : null}
        </section>

        <section className="spot-grid">
          {filtered.map((spot) => (
            <motion.article className="spot-card" key={spot.id} whileHover={{ y: -6 }}>
              <div className="spot-head">
                <h3>Spot #{spot.spotNumber}</h3>
                <span className={`badge ${spot.reserved ? "off" : "on"}`}>{spot.reserved ? "Reserved" : "Available"}</span>
              </div>
              <p>{spot.location || "Level 1"}</p>
              <p>{spot.spotType || "STANDARD"}</p>
              <strong>${Number(spot.pricePerHour || 0).toFixed(2)} / hr</strong>
              <button className="btn-primary" disabled={spot.reserved} onClick={() => reserve(spot.id)}>
                {spot.reserved ? "Unavailable" : "Reserve"}
              </button>
            </motion.article>
          ))}
        </section>
      </AnimatedPage>
    </AppShell>
  );
}
