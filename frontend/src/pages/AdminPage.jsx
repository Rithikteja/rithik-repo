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
  const [addingSpot, setAddingSpot] = useState(false);
  const [spotForm, setSpotForm] = useState({
    spotNumber: "",
    location: "",
    spotType: "STANDARD",
    pricePerHour: ""
  });

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

  async function addSpot(event) {
    event.preventDefault();

    if (!spotForm.spotNumber || !spotForm.location || !spotForm.pricePerHour) {
      setMessage("Spot number, location and price are required.");
      return;
    }

    setAddingSpot(true);
    setMessage("Adding parking spot...");

    try {
      const data = await api("/api/parking/spots/add", {
        method: "POST",
        body: JSON.stringify({
          spotNumber: Number(spotForm.spotNumber),
          location: spotForm.location.trim(),
          spotType: spotForm.spotType,
          pricePerHour: Number(spotForm.pricePerHour),
          reserved: false
        })
      });

      if (data?.success) {
        setMessage("Spot added successfully.");
        setSpotForm({ spotNumber: "", location: "", spotType: "STANDARD", pricePerHour: "" });
        const refreshed = await api("/api/parking/spots");
        setSpots(refreshed || []);
      } else {
        setMessage(data?.message || "Could not add spot.");
      }
    } catch (e) {
      setMessage(e.message || "Could not add spot.");
    } finally {
      setAddingSpot(false);
    }
  }

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
          {tab === "spots" && (
            <>
              <form onSubmit={addSpot} className="panel" style={{ marginTop: 0 }}>
                <h3 style={{ marginBottom: 10 }}>Add New Spot</h3>
                <div className="filters">
                  <input
                    type="number"
                    placeholder="Spot number"
                    value={spotForm.spotNumber}
                    onChange={(e) => setSpotForm({ ...spotForm, spotNumber: e.target.value })}
                  />
                  <input
                    placeholder="Location (e.g., Level 1 - A12)"
                    value={spotForm.location}
                    onChange={(e) => setSpotForm({ ...spotForm, location: e.target.value })}
                  />
                  <select
                    value={spotForm.spotType}
                    onChange={(e) => setSpotForm({ ...spotForm, spotType: e.target.value })}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="COMPACT">Compact</option>
                    <option value="HANDICAP">Handicap</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price per hour"
                    value={spotForm.pricePerHour}
                    onChange={(e) => setSpotForm({ ...spotForm, pricePerHour: e.target.value })}
                  />
                </div>
                <button className="btn-primary" type="submit" disabled={addingSpot}>
                  {addingSpot ? "Adding..." : "Add Spot"}
                </button>
              </form>

              {spots.map((spot) => (
                <div className="list-row" key={spot.id}>
                  <strong>Spot #{spot.spotNumber}</strong>
                  <span>{spot.location}</span>
                  <span>{spot.reserved ? "Reserved" : "Available"}</span>
                </div>
              ))}
            </>
          )}

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
