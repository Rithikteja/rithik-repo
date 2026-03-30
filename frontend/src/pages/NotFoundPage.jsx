import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="center-screen">
      <h2>Page not found</h2>
      <Link to="/dashboard">Go back</Link>
    </div>
  );
}
