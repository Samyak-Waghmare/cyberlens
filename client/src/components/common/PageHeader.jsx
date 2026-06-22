/**
 * Reusable page-level header shown at the top of each tool page.
 * Displays an icon, title, and description + a breadcrumb back to home.
 */
import { Link } from "react-router-dom";

export default function PageHeader({ icon, title, description }) {
  return (
    <div className="page-header">
      <Link to="/" className="breadcrumb">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        All tools
      </Link>
      <div className="page-header-content">
        <span className="page-header-icon" aria-hidden="true">{icon}</span>
        <div>
          <h1 className="page-header-title">{title}</h1>
          <p className="page-header-desc">{description}</p>
        </div>
      </div>
    </div>
  );
}
