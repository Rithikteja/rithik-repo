import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import AppShell from "../components/AppShell";
import AnimatedPage from "../components/AnimatedPage";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/api/reservations/${bookingId}`).then(setBooking).catch((e) => setMessage(e.message));
  }, [bookingId]);

  async function pay(e) {
    e.preventDefault();
    setProcessing(true);
    setMessage("Processing payment...");
    try {
      const data = await api(`/api/reservations/${bookingId}/pay`, { method: "POST" });
      if (data?.success) {
        setMessage("Payment successful. Redirecting...");
        setTimeout(() => navigate("/bookings"), 1200);
      }
    } catch (e2) {
      setMessage(e2.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AppShell title="Secure Payment" subtitle="Complete your booking in one step.">
      <AnimatedPage>
        <motion.section className="panel payment-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Booking #{bookingId}</h2>
          <p>Total: ${Number(booking?.totalPrice || 0).toFixed(2)}</p>
          <p>Status: {booking?.paymentStatus || "PENDING"}</p>

          <form onSubmit={pay} className="stack">
            <input placeholder="Card number" required maxLength={19} />
            <input placeholder="Cardholder name" required />
            <div className="filters">
              <input placeholder="MM/YY" required />
              <input placeholder="CVV" required maxLength={3} />
            </div>
            <button className="btn-primary" type="submit" disabled={processing}>
              {processing ? "Processing..." : "Pay Now"}
            </button>
          </form>
          {message ? <p className="inline-message">{message}</p> : null}
        </motion.section>
      </AnimatedPage>
    </AppShell>
  );
}
