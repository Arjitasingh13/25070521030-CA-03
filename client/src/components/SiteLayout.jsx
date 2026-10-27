import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from '../auth-context.js';

const navItems = [
  ['Home', '/home'],
  ['Events', '/events'],
  ['Schedule', '/schedule'],
  ['About', '/about'],
  ['Speakers', '/speakers'],
  ['Meet Creator', '/developer'],
];

export function SiteLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    function closeExploreOnOutsideClick(event) {
      if (!exploreRef.current?.contains(event.target)) {
        setExploreOpen(false);
      }
    }

    document.addEventListener('click', closeExploreOnOutsideClick);
    return () => document.removeEventListener('click', closeExploreOnOutsideClick);
  }, []);

  const avatarLabel = user?.name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U';
  const isWelcomePage = location.pathname === '/';
  const showSiteChrome = isAuthenticated && !isWelcomePage;

  return (
    <div className={`site-shell min-h-screen ${isWelcomePage ? 'welcome-shell' : ''}`}>
      {showSiteChrome && <header className="site-header">
        <div className="nav-wrap">
          <Link to="/" className="brand" aria-label="EventSpark home">
            <span className="brand-mark"><Sparkles size={18} /></span>
            <span className="brand-word">event<span className="brand-light">spark</span><i>.</i></span>
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            {navItems.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => { setExploreOpen(false); setMenuOpen(false); }} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                {label}
              </NavLink>
            ))}
            <details className="nav-more" ref={exploreRef} open={exploreOpen}>
              <summary onClick={(event) => { event.preventDefault(); setExploreOpen((open) => !open); }}>Explore <ChevronDown size={13} /></summary>
              <div className="nav-more-menu">
                <Link to="/sponsors" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Sponsors & partners</Link>
                <Link to="/gallery" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Festival highlights</Link>
                <Link to="/faq" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Frequently asked questions</Link>
                <Link to="/contact" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Helpdesk & contact</Link>
                <Link to="/add-event" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Host an event</Link>
                <Link to="/manage" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Manage events</Link>
              </div>
            </details>
            {isAuthenticated ? (
              <div className="nav-profile">
                <Link to="/profile" className="nav-profile-link" onClick={() => { setExploreOpen(false); setMenuOpen(false); }} aria-label={`${user.name} profile`}>
                  <span className="nav-avatar" aria-hidden="true">{avatarLabel}</span>
                  <span className="nav-profile-name">{user.name}</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="nav-login" onClick={() => { setExploreOpen(false); setMenuOpen(false); }}>Sign in <ArrowUpRight size={15} /></Link>
            )}
          </nav>
        </div>
      </header>}
      <main className={`site-main ${showSiteChrome ? '' : 'site-main-no-header'}`}>{children}</main>
      {showSiteChrome && <footer className="site-footer">
        <div className="footer-main">
          <div>
            <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span className="brand-word">event<span className="brand-light">spark</span><i>.</i></span></Link>
            <p>Where curious minds meet their next big idea.</p>
          </div>
          <div className="footer-links">
            <Link to="/events">Explore events</Link><Link to="/schedule">Festival schedule</Link><Link to="/speakers">Meet the speakers</Link><Link to="/sponsors">Our partners</Link><Link to="/contact">Get in touch</Link><Link to="/faq">FAQs</Link><Link to="/manage">Organizer portal</Link>
          </div>
          <Link to="/signup" className="footer-cta">Be part of it <ArrowUpRight size={16} /></Link>
        </div>
        <div className="footer-bottom"><span>© 2026 EventSpark Festival</span><span>Built for the curious · Bengaluru, India</span></div>
      </footer>}
    </div>
  );
}
