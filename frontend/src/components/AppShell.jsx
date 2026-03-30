import { CarFront, LayoutDashboard, LogOut, MapPinned, ReceiptText, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSessionUser } from "../api";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/browse", label: "Browse", icon: MapPinned },
  { to: "/bookings", label: "Bookings", icon: ReceiptText },
  { to: "/admin", label: "Admin", icon: ShieldCheck }
];

export default function AppShell({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-bg">
      <div className="container">
        <nav className="topbar">
          <div className="brand">
            <CarFront size={18} />
            <span>Smart Parking</span>
          </div>
          <div className="navlinks">
            {links.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.to);
              return (
                <Link className={`navlink ${active ? "active" : ""}`} to={item.to} key={item.to}>
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
            <button
              className="navlink logout"
              type="button"
              onClick={() => {
                clearSessionUser();
                navigate("/login");
              }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </nav>

        <header className="hero-card">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </header>

        {children}
      </div>
    </div>
  );
}
