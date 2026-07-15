import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/',        label: 'Dashboard' },
  { path: '/upload',  label: 'Upload'    },
  { path: '/history', label: 'History'   },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <span>Clear<span className="navbar__logo-accent">Cut</span></span>
        </Link>

        {/* Links */}
        <ul className="navbar__links">
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : ''}`}
              >
                {label}
                {location.pathname === path && <span className="navbar__link-dot" />}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/upload" className="btn btn-primary btn-sm navbar__cta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Remove BG
        </Link>
      </div>
    </nav>
  );
}
