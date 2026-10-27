import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, Ticket } from 'lucide-react';
import { apiRequest, getEvents } from '../api.js';
import { useAuth } from '../auth-context.js';
import { AuthActionNotice, FormField, FormShell, StatusMessage } from '../components/PageParts.jsx';

export default function RegisterEventPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(location.state?.eventId || searchParams.get('eventId') || '');
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [loading, setLoading] = useState(false);
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    let cancelled = false;
    getEvents()
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events);
        const requestedTitle = location.state?.eventTitle || searchParams.get('event') || searchParams.get('eventTitle');
        const requestedId = location.state?.eventId || searchParams.get('eventId');
        const requestedEvent = requestedId
          ? data.events.find((item) => item._id === requestedId)
          : requestedTitle
            ? data.events.find((item) => item.title.toLowerCase() === requestedTitle.toLowerCase())
            : null;
        if (requestedEvent) setSelectedEventId(requestedEvent._id);
      })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [location.state, searchParams]);
  function requireSignIn(event) {
    if (isAuthenticated) return false;
    event.preventDefault();
    setShowAuthNotice(true);
    return true;
  }
  async function submit(event) {
    event.preventDefault();
    if (requireSignIn(event)) return;
    setShowAuthNotice(false); setError(''); setSuccess(''); setLoading(true);
    const form = event.currentTarget;
    try { const data = await apiRequest('/register', { method: 'POST', body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), eventId: selectedEventId }) }); setSuccess(data.message); form.reset(); setSelectedEventId(''); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <FormShell eyebrow="MAKE IT OFFICIAL" title={<>Save your<br /><em>spot.</em></>} subtitle="Tell us a little about yourself and we&apos;ll see you there." aside={<><Ticket /><h2>One small<br />form. Big things.</h2><p>Your registration helps us get the right people, spaces, and snacks in the room.</p><span>CAN&apos;T WAIT TO MEET YOU</span></>}><form onSubmit={submit}><StatusMessage error={error} success={success} />{showAuthNotice && <AuthActionNotice />}
    <FormField label="Choose an event"><select name="eventId" required value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)}><option value="" disabled>Select an event</option>{events.map((event) => <option key={event._id} value={event._id}>{event.title}</option>)}</select></FormField>
    <div className="form-row"><FormField label="Full name"><input name="name" required placeholder="Your name" /></FormField><FormField label="Email address"><input name="email" type="email" required placeholder="you@example.com" /></FormField></div>
    <div className="form-row"><FormField label="Phone number"><input name="phone" type="tel" required placeholder="+91 98765 43210" /></FormField><FormField label="College / organization"><input name="college" required placeholder="Where you study or work" /></FormField></div>
    <div className="form-row"><FormField label="Team name (optional)"><input name="teamName" placeholder="Solo if you don't have one" /></FormField><FormField label="Number of participants"><input name="participants" type="number" min="1" max="20" defaultValue="1" /></FormField></div>
    <button className="button button-dark full-width" disabled={loading || !events.length} onClick={requireSignIn}>{loading ? 'Saving your spot...' : 'Register for this event'} <ArrowRight size={17} /></button>
  </form></FormShell>;
}
