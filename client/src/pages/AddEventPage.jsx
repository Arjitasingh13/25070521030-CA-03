import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth-context.js';
import { categories } from '../utils/eventData.js';
import { AuthActionNotice, FormField, FormShell, StatusMessage } from '../components/PageParts.jsx';

export default function AddEventPage() {
  const navigate = useNavigate(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  async function submit(event) {
    event.preventDefault();
    if (!isAuthenticated) return;
    setError(''); setLoading(true);
    try { const data = await apiRequest('/events', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }, true); navigate('/manage', { state: { notice: 'Your event is on the lineup.', createdEvent: data.event } }); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <FormShell eyebrow="FOR THE ORGANIZERS" title={<>Put it on<br /><em>the map.</em></>} subtitle="A great event starts with an idea. Give it a home here." aside={<><MoveUpRight /><h2>Make something<br />happen.</h2><p>Bring your people together. The next can't-miss moment could start right here.</p><span>HOST SOMETHING GREAT</span></>}>
    {!isAuthenticated ? <AuthActionNotice message="Sign in first to manage events!" /> : <form className="host-event-form" onSubmit={submit}>
      <StatusMessage error={error} />
      <FormField label="Event title"><input name="title" required placeholder="Give your event a name" /></FormField>
      <FormField label="Description"><textarea name="description" rows="4" required placeholder="What will people build, learn, or discover?" /></FormField>
      <div className="form-row"><FormField label="Date and time"><input type="datetime-local" name="date" required /></FormField><FormField label="Venue"><input name="venue" required placeholder="Building, room, or space" /></FormField></div>
      <div className="form-row"><FormField label="Category"><select name="category" required defaultValue=""><option value="" disabled>Choose a category</option>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></FormField><FormField label="Prize pool"><input name="prizePool" required placeholder="e.g. ₹50,000 + goodies" /></FormField></div>
      <div className="form-row"><FormField label="Timings"><input name="timings" placeholder="e.g. 10:00 AM – 05:00 PM" /></FormField><FormField label="Rules"><input name="rules" placeholder="Any important details?" /></FormField></div>
      <button className="button button-dark full-width" disabled={loading}>{loading ? 'Publishing...' : 'Publish event'} <ArrowRight size={17} /></button>
    </form>}
  </FormShell>;
}
