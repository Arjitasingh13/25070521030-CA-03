import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { getSchedule } from '../api.js';
import { PageIntro, StatusMessage } from '../components/PageParts.jsx';

export default function SchedulePage() {
  const [selected, setSelected] = useState(0);
  const [festivalSchedule, setFestivalSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getSchedule()
      .then((data) => { if (active) setFestivalSchedule(data.days || []); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const formatDay = (date) => new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="content-section section-pad schedule-page">
      <PageIntro eyebrow="THREE DAYS / ENDLESS POSSIBILITIES" title={<>Plan your<br /><em>festival.</em></>} description="A first look at the moments, meetups and maker sessions across the weekend. Times and locations may be updated as the festival approaches." />
      <StatusMessage error={error && `${error} Check that the EventSpark server and MongoDB are running.`} />
      {loading ? <div className="loading-state">Loading the festival schedule...</div> : null}
      {!loading && festivalSchedule.length > 0 && <>
      <div className="schedule-tabs" role="tablist" aria-label="Festival days">
        {festivalSchedule.map((day, index) => (
          <button
            key={day.dayNumber}
            id={`schedule-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls="schedule-panel"
            onClick={() => setSelected(index)}
            className={`schedule-tab ${selected === index ? 'selected' : ''}`}
          >
            <span>{day.label}</span>
            <strong><CalendarDays size={17} />{formatDay(day.date)}</strong>
          </button>
        ))}
      </div>
      <div className="schedule-list" id="schedule-panel" role="tabpanel" aria-labelledby={`schedule-tab-${selected}`}>
        {festivalSchedule[selected].entries.map((entry, index) => (
          <article className="schedule-item" key={`${entry.time}-${entry.title}`}>
            <div className="schedule-time"><Clock3 size={17} /><span>{entry.time}</span></div>
            <div className="schedule-event-copy">
              <span className="schedule-entry-index">SESSION {String(index + 1).padStart(2, '0')}</span>
              <h3>{entry.title}</h3>
              <p><MapPin size={16} />{entry.venue}</p>
            </div>
            <span className="schedule-live">EVENTSPARK ’26</span>
          </article>
        ))}
      </div>
      <div className="schedule-cta"><p>Found your moment?</p><Link to="/events" className="button button-dark">Find an event <ArrowRight size={16} /></Link></div>
      </>}
    </section>
  );
}
