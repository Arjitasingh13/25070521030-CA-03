import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Code2, Cpu, MapPin, Shield, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../auth-context.js';
import { formatDate } from '../utils/eventData.js';

export function PageIntro({ eyebrow, title, description, compact = false }) {
  return (
    <div className={`page-intro ${compact ? 'compact' : ''}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="intro-copy">{description}</p>}
    </div>
  );
}

export function StatusMessage({ error, success }) {
  if (!error && !success) return null;
  return <div className={`status-message ${error ? 'error' : 'success'}`} role="status">{error || success}</div>;
}

export function AuthActionNotice({ message = 'Sign in first to publish or register for events!' }) {
  return (
    <div className="auth-action-notice" role="alert">
      <ShieldAlert size={21} aria-hidden="true" />
      <p>{message}</p>
      <Link to="/login">Sign in <ArrowUpRight size={15} /></Link>
    </div>
  );
}

export function EventCard({ event, index = 0 }) {
  const { isAuthenticated } = useAuth();
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  const color = ['lavender', 'peach', 'mint', 'blue'][index % 4];
  const categoryText = `${event.category} ${event.title}`.toLowerCase();
  const artwork = categoryText.includes('physics') || categoryText.includes('quantum')
    ? { image: 'photo-1635070041078-e363dbe005cb', label: 'PHYSICS & QUANTUM', alt: 'Abstract physics-inspired light and wave patterns' }
    : categoryText.includes('ai') || categoryText.includes('neural') || categoryText.includes('machine')
      ? { image: 'photo-1677442136019-21780ecad995', label: 'AI & MACHINE LEARNING', alt: 'Artificial intelligence technology visualization' }
      : categoryText.includes('cyber') || categoryText.includes('security') || categoryText.includes('ctf')
        ? { image: 'photo-1550751827-4bd374c3f58b', label: 'CYBERSECURITY LAB', alt: 'Cybersecurity code and glowing digital circuits' }
        : categoryText.includes('robot')
          ? { image: 'photo-1485827404703-89b55fcc595e', label: 'ROBOTICS STUDIO', alt: 'Robotics prototype in a technology lab' }
          : categoryText.includes('design') || categoryText.includes('ui')
            ? { image: 'photo-1558655146-9f40138edfeb', label: 'DESIGN & CREATIVE TECH', alt: 'Colorful creative design and visual ideas' }
            : categoryText.includes('workshop') || categoryText.includes('cloud')
              ? { image: 'photo-1531482615713-2afd69097998', label: 'HANDS-ON WORKSHOP', alt: 'Technology workshop with participants collaborating' }
              : { image: 'photo-1504384308090-c894fdcc538d', label: 'BUILD SPRINT', alt: 'Hackathon team collaborating around laptops' };
  return (
    <article className="event-card">
      <div className={`event-art ${color}`}>
        <img
          className="event-art-image"
          src={`https://images.unsplash.com/${artwork.image}?auto=format&fit=crop&w=900&q=80`}
          alt={artwork.alt}
          loading="lazy"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        <span className="art-index">0{index + 1} / {artwork.label}</span>
        <span className="art-icon">{event.category?.toLowerCase().includes('robot') ? <Cpu /> : event.category?.toLowerCase().includes('cyber') ? <Shield /> : event.category?.toLowerCase().includes('workshop') ? <Code2 /> : <Zap />}</span>
        <span className="event-category">{event.category}</span>
      </div>
      <div className="event-card-content">
        <div className="event-meta"><span><CalendarDays size={14} />{formatDate(event.date)}</span><span><MapPin size={14} />{event.venue}</span></div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-card-bottom">
          <span className="prize">{event.prizePool} <small>in prizes</small></span>
          <div className="event-card-actions">
            {isAuthenticated
              ? <Link to={`/register-event?eventId=${event._id}`} state={{ eventId: event._id, eventTitle: event.title }} className="event-register-link">Register</Link>
              : <button type="button" className="event-register-link" onClick={() => setShowAuthNotice(true)}>Register</button>}
            <Link to={`/events/${event._id}`} className="round-arrow" aria-label={`View ${event.title}`}><ArrowUpRight size={19} /></Link>
          </div>
        </div>
        {showAuthNotice && <AuthActionNotice />}
      </div>
    </article>
  );
}

export function FormField({ label, children }) { return <label className="form-field"><span>{label}</span>{children}</label>; }
export function FormShell({ eyebrow, title, subtitle, children, aside, className = '' }) {
  return <section className={`form-page section-pad ${className}`.trim()}><div className="form-layout"><div className="form-card"><PageIntro eyebrow={eyebrow} title={title} description={subtitle} compact />{children}</div><aside className="form-aside">{aside}</aside></div></section>;
}
