import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Building2, CalendarDays, LogOut, Mail, MapPin, MessageSquareText, Phone, UserRound, Users, X } from 'lucide-react';
import { useAuth } from '../auth-context.js';
import { apiRequest } from '../api.js';

const formatDate = (value) => {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date to be announced' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ProfilePage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState({ registrations: [], queries: [] });
  const [loadedEmail, setLoadedEmail] = useState(null);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const loading = Boolean(isAuthenticated && user?.email && loadedEmail !== user.email);
  const avatar = user?.name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U';

  useEffect(() => {
    if (!selectedRegistration) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedRegistration(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedRegistration]);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return undefined;
    let active = true;
    apiRequest(`/user/activity?email=${encodeURIComponent(user.email)}`, {}, true)
      .then((data) => {
        if (active) {
          setActivity({ registrations: data.registrations || [], queries: data.queries || [] });
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoadedEmail(user.email);
      });
    return () => { active = false; };
  }, [isAuthenticated, user?.email]);

  function logout() {
    signOut();
    navigate('/home', { replace: true });
  }

  if (!isAuthenticated || !user) {
    return (
      <section className="content-section section-pad profile-page">
        <div className="profile-locked glass-panel">
          <UserRound size={38} />
          <p className="eyebrow"><span /> YOUR EVENTSPARK ACCOUNT</p>
          <h1>Sign in to see your <em>profile.</em></h1>
          <p>Your registrations and helpdesk messages will be waiting here.</p>
          <Link to="/login" className="button button-dark">Sign in <ArrowRight size={17} /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section section-pad profile-page">
      <div className="profile-heading">
        <div>
          <p className="eyebrow"><span /> YOUR EVENTSPARK ACCOUNT</p>
          <h1>Your <em>profile.</em></h1>
          <p className="intro-copy">Your festival plans, registrations, and conversations — all in one place.</p>
        </div>
        <button className="button profile-logout" onClick={logout}><LogOut size={17} /> Log out</button>
      </div>

      <article className="profile-user-card glass-panel">
        <div className="profile-avatar" aria-hidden="true">{avatar}</div>
        <div className="profile-user-info">
          <span className="profile-kicker">FESTIVAL MEMBER</span>
          <h2>{user.name}</h2>
          <p><Mail size={17} />{user.email}</p>
        </div>
        <span className="profile-member-badge">EVENTSPARK ’26</span>
      </article>

      {error && <div className="status-message error" role="alert">{error}</div>}

      <div className="profile-activity-grid">
        <section className="profile-activity-section glass-panel">
          <div className="profile-section-heading">
            <div><span className="profile-kicker">YOUR FESTIVAL LINEUP</span><h2>My registered events</h2></div>
            <span className="profile-count">{activity.registrations.length}</span>
          </div>
          {loading ? <div className="loading-state">Loading your registrations...</div> : activity.registrations.length ? (
            <div className="profile-table-wrap">
              <table className="profile-table">
                <thead><tr><th>Event</th><th>Date</th><th>Venue</th><th>College</th></tr></thead>
                <tbody>{activity.registrations.map((registration) => {
                  const event = registration.eventId && typeof registration.eventId === 'object' ? registration.eventId : null;
                  return <tr
                    key={registration._id}
                    className="profile-registration-row"
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`View registration details for ${event?.title || registration.eventTitle || 'event'}`}
                    onClick={() => setSelectedRegistration(registration)}
                    onKeyDown={(keyEvent) => {
                      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                        keyEvent.preventDefault();
                        setSelectedRegistration(registration);
                      }
                    }}
                  >
                    <td><strong>{event?.title || registration.eventTitle || 'Event'}</strong></td>
                    <td><span className="profile-table-icon"><CalendarDays size={15} />{formatDate(event?.date)}</span></td>
                    <td><span className="profile-table-icon"><MapPin size={15} />{event?.venue || 'Venue to be announced'}</span></td>
                    <td>{registration.college}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          ) : (
            <div className="profile-empty-state">
              <CalendarDays size={30} />
              <h3>Your next adventure is out there.</h3>
              <p>You haven&apos;t registered for an event yet. Find something that sparks your curiosity.</p>
              <Link to="/events" className="inline-link">Explore events &amp; register <ArrowRight size={17} /></Link>
            </div>
          )}
        </section>

        <section className="profile-activity-section glass-panel">
          <div className="profile-section-heading">
            <div><span className="profile-kicker">HELPDESK HISTORY</span><h2>My submitted queries</h2></div>
            <span className="profile-count">{activity.queries.length}</span>
          </div>
          {loading ? <div className="loading-state">Loading your messages...</div> : activity.queries.length ? (
            <div className="profile-query-list">
              {activity.queries.map((query) => <article className="profile-query-card" key={query._id}>
                <div className="profile-query-title"><MessageSquareText size={18} /><h3>{query.subject}</h3></div>
                <p>{query.message}</p>
                <time dateTime={query.createdAt}>{formatDate(query.createdAt)}</time>
              </article>)}
            </div>
          ) : (
            <div className="profile-empty-state profile-query-empty">
              <MessageSquareText size={30} />
              <h3>All clear in your inbox.</h3>
              <p>Messages you send to the helpdesk will appear here.</p>
              <Link to="/contact" className="inline-link">Contact the helpdesk <ArrowRight size={17} /></Link>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedRegistration && (() => {
          const event = selectedRegistration.eventId && typeof selectedRegistration.eventId === 'object'
            ? selectedRegistration.eventId
            : null;
          const details = [
            { label: 'Full name', value: selectedRegistration.name, icon: UserRound },
            { label: 'Email address', value: selectedRegistration.email, icon: Mail },
            { label: 'Phone number', value: selectedRegistration.phone, icon: Phone },
            { label: 'College / organization', value: selectedRegistration.college, icon: Building2 },
            { label: 'Team name', value: selectedRegistration.teamName || 'Solo', icon: Users },
            { label: 'Number of participants', value: selectedRegistration.participants ?? 1, icon: Users },
          ];

          return (
            <motion.div
              className="profile-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(clickEvent) => {
                if (clickEvent.target === clickEvent.currentTarget) setSelectedRegistration(null);
              }}
            >
              <motion.section
                className="profile-registration-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="registration-modal-title"
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="profile-modal-heading">
                  <div>
                    <span className="profile-kicker">REGISTRATION DETAILS</span>
                    <h2 id="registration-modal-title">{event?.title || selectedRegistration.eventTitle || 'Event registration'}</h2>
                  </div>
                  <button
                    type="button"
                    className="profile-modal-close"
                    aria-label="Close registration details"
                    autoFocus
                    onClick={() => setSelectedRegistration(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="profile-registration-details">
                  {details.map(({ label, value, icon: Icon }) => (
                    <div className="profile-registration-detail" key={label}>
                      <span className="profile-registration-detail-icon"><Icon size={18} /></span>
                      <div>
                        <span className="profile-registration-label">{label}</span>
                        <strong>{value || 'Not provided'}</strong>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="button button-dark profile-modal-dismiss"
                  onClick={() => setSelectedRegistration(null)}
                >
                  Close
                </button>
              </motion.section>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
