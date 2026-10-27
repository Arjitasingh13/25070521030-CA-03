import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getEvents } from '../api.js';
import { categories } from '../utils/eventData.js';
import { EventCard, PageIntro, StatusMessage } from '../components/PageParts.jsx';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    getEvents().then((data) => setEvents(data.events)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);
  const filtered = events.filter((event) => (category === 'All' || event.category === category) && `${event.title} ${event.description}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="content-section section-pad"><PageIntro eyebrow="THE LINEUP / 2026" title={<>Find your<br /><em>thing.</em></>} description="Build something weird, learn from people who know their stuff, and find your next favorite collaborators." />
    <div className="catalog-tools"><div className="filter-row">{categories.map((item) => <button className={`filter-chip ${category === item ? 'selected' : ''}`} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the lineup..." aria-label="Search events" /></div>
    {error && <StatusMessage error={`${error} Check that the EventSpark server and MongoDB are running.`} />}
    {loading ? <div className="loading-state">Finding your next thing<span className="loading-dots">...</span></div> : filtered.length ? <div className="event-grid catalog-grid">{filtered.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <div className="empty-state"><Sparkles /><h3>No events found just yet.</h3><p>Try another search or category.</p></div>}
  </section>;
}
