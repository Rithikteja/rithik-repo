import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../api";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getSessionUser();
    const timer = setTimeout(() => {
      navigate(user ? "/dashboard" : "/login", { replace: true });
    }, 250);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="center-screen">
      <div className="pulse-dot" />
      <p>Launching Smart Parking...</p>
    </div>
  );
}
