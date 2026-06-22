import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="nf-code">404</div>
      <h1 className="nf-title">SYSTEM ERROR: ROUTE NOT FOUND</h1>
      <p className="nf-sub">
        The requested module does not exist or access is restricted.
      </p>
      <Link to="/" className="hero-cta" style={{ display: "inline-flex", marginTop: "1rem" }}>
        [ RETURN TO MAIN ]
      </Link>
    </div>
  );
}
