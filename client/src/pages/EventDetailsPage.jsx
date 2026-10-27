import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth-context.js';
import { formatDate } from '../utils/eventData.js';
import { AuthActionNotice, StatusMessage } from '../components/PageParts.jsx';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  useEffect(() => { apiRequest(`/events/${id}`).then((data) => setEvent(data.event)).catch((err) => setError(err.message)); }, [id]);
  function requireSignIn(clickEvent) {
    if (isAuthenticated) return;
    clickEvent.preventDefault();
    setShowAuthNotice(true);
  }
  if (error) return <section className="content-section section-pad"><StatusMessage error={error} /><Link to="/events" className="inline-link"><ArrowLeft size={16} /> Back to all events</Link></section>;
  if (!event) return <section className="content-section section-pad"><div className="loading-state">Loading event details...</div></section>;
  return <section className="content-section section-pad"><Link to="/events" className="back-link"><ArrowLeft size={16} /> Back to the lineup</Link>{showAuthNotice && <AuthActionNotice />}<div className="details-layout"><div><p className="eyebrow"><span />{event.category} / EVENT DETAILS</p><h1 className="details-title">{event.title}</h1><p className="details-description">{event.description}</p><div className="details-panels"><div><h3>Good to know</h3><p>{event.rules}</p></div><div><h3>On the day</h3><p>{event.timings}</p></div></div></div><aside className="details-aside"><span className="event-category">{event.category}</span><p className="aside-prize">{event.prizePool}</p><span className="aside-label">UP FOR GRABS</span><div className="aside-meta"><span><CalendarDays />{formatDate(event.date)}</span><span><Clock3 />{event.timings}</span><span><MapPin />{event.venue}</span></div><Link to={`/register-event?eventId=${event._id}`} state={{ eventId: event._id, eventTitle: event.title }} onClick={requireSignIn} className="button button-dark full-width">Save your spot <ArrowRight size={17} /></Link></aside></div></section>;
}
