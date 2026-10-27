import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { apiRequest, getEvents } from '../api.js';
import { useAuth } from '../auth-context.js';
import { formatDate } from '../utils/eventData.js';
import { AuthActionNotice, PageIntro, StatusMessage } from '../components/PageParts.jsx';

function userCanManageEvent(event, user) {
  if (event.canDelete === true) return true;

  const userId = user?.id || user?._id;
  const creatorId = event.createdBy?._id || event.createdBy?.id || event.createdBy;
  if (userId && creatorId && String(userId) === String(creatorId)) return true;

  const userEmail = String(user?.email || '').trim().toLowerCase();
  const creatorEmail = String(event.createdByEmail || event.createdBy?.email || '').trim().toLowerCase();
  return Boolean(userEmail && creatorEmail && userEmail === creatorEmail);
}

export default function ManageEventsPage() {
  const location = useLocation();
  const [events, setEvents] = useState([]); const [error, setError] = useState(''); const [notice, setNotice] = useState(location.state?.notice || ''); const [loading, setLoading] = useState(true);
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    let cancelled = false;
    getEvents(isAuthenticated)
      .then((data) => {
        if (cancelled) return;
        const fetchedEvents = data.events || [];
        const createdEvent = location.state?.createdEvent;
        const mergedEvents = createdEvent && !fetchedEvents.some((event) => event._id === createdEvent._id)
          ? [createdEvent, ...fetchedEvents]
          : fetchedEvents;
        setEvents(mergedEvents);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isAuthenticated, location.state?.createdEvent]);
  function handleAddEvent(event) {
    event.preventDefault();
    setShowAuthNotice(true);
  }
  async function removeEvent(id) {
    if (!isAuthenticated) {
      setShowAuthNotice(true);
      return;
    }
    if (!window.confirm('Delete this event from the lineup? This cannot be undone.')) return;
    setError(''); setNotice('');
    try { await apiRequest(`/events/${id}`, { method: 'DELETE' }, true); setEvents((current) => current.filter((event) => event._id !== id)); setNotice('Event deleted.'); }
    catch (err) { setError(err.message); }
  }
  return <section className="content-section section-pad"><PageIntro eyebrow="THE CONTROL ROOM" title={<>Make it<br /><em>happen.</em></>} description="Keep the lineup fresh. Add what’s next, or tidy up what’s already here." />{showAuthNotice && <AuthActionNotice message="Sign in first to manage events!" />}{!isAuthenticated && <p className="auth-hint">Sign in to add or delete events. <Link to="/login">Sign in here <ArrowUpRight size={13} /></Link></p>}<div className="manage-actions"><StatusMessage error={error} success={notice} />{isAuthenticated ? <Link to="/add-event" className="button button-dark">Add an event <ArrowRight size={17} /></Link> : <button type="button" className="button button-dark" onClick={handleAddEvent}>Add an event <ArrowRight size={17} /></button>}</div>
    {loading ? <div className="loading-state">Loading your lineup...</div> : <div className="table-wrap"><table><thead><tr><th>Event</th><th>Date</th><th>Category</th><th>Prize pool</th><th /></tr></thead><tbody>{events.map((event) => <tr key={event._id}><td><strong>{event.title}</strong><small>{event.venue}</small></td><td>{formatDate(event.date)}</td><td><span className="table-category">{event.category}</span></td><td>{event.prizePool}</td><td>{isAuthenticated && userCanManageEvent(event, user) && <button className="delete-button" onClick={() => removeEvent(event._id)}>Delete</button>}</td></tr>)}</tbody></table>{!events.length && <div className="empty-state"><h3>No events on the lineup.</h3>{isAuthenticated ? <Link to="/add-event" className="inline-link">Add the first one <ArrowRight size={16} /></Link> : <button type="button" className="inline-link" onClick={handleAddEvent}>Add the first one <ArrowRight size={16} /></button>}</div>}</div>}
  </section>;
}
