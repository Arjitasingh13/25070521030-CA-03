import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Cpu, Radio, Sparkles, Zap } from 'lucide-react';
import { getEvents, getFestivalInfo } from '../api.js';
import { EventCard, StatusMessage } from '../components/PageParts.jsx';
import { fallbackHighlights, fallbackStats } from '../utils/festivalData.js';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({});
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState('');
  const [festivalInfo, setFestivalInfo] = useState(null);
  useEffect(() => {
    const target = new Date('2026-11-20T09:00:00+05:30').getTime();
    const tick = () => {
      const distance = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    getEvents().then((data) => setEvents(data.events.slice(0, 3))).catch((error) => setEventsError(error.message));
    getFestivalInfo().then((data) => setFestivalInfo(data.info)).catch(() => {});
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-ribbon"><span>INDIA&apos;S CAMPUS TECH FESTIVAL</span><span>20—22 NOVEMBER 2026 <ArrowUpRight size={13} /></span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-tag"><span className="live-dot" /> BENGALURU, INDIA <span className="tag-divider">·</span> OPEN TO EVERYONE</div>
            <h1>Ideas that<br />move <span>India.</span></h1>
            <p className="hero-description">Meet the builders, dreamers and doers shaping what comes next. Three days of technology, creativity and campus energy — all in one place.</p>
            <div className="hero-actions"><Link to="/events" className="button button-dark">Explore the festival <ArrowRight size={17} /></Link><Link to="/signup" className="button button-text">Join the community <ArrowUpRight size={16} /></Link></div>
            <div className="countdown">
              <span className="countdown-label">THE NEXT SPARK STARTS IN</span>
              <div className="countdown-values">{['days', 'hours', 'minutes', 'seconds'].map((unit) => <div key={unit}><strong>{String(timeLeft[unit] ?? 0).padStart(2, '0')}</strong><small>{unit}</small></div>)}</div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Students building technology together at a festival">
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=85" alt="Students collaborating around a laptop" fetchPriority="high" />
            <div className="hero-image-overlay" />
            <div className="photo-stamp"><Sparkles size={18} /><span>CURIOUS MINDS.<br />UNLIMITED SIGNAL.</span></div>
            <div className="hero-image-caption"><span>THE FUTURE IS A</span><b>GROUP PROJECT.</b><small>INDIA / 2026 — SAVE YOUR SEAT</small></div>
            <span className="image-credit">BUILT BY THE NEXT GENERATION</span>
          </div>
        </div>
        <div className="hero-bottom"><span><Radio size={15} /> TECHNOLOGY · CULTURE · PEOPLE</span><span>SCROLL TO EXPLORE <ArrowDown size={15} /></span></div>
      </section>

      <section className="manifesto section-pad">
        <div className="section-label"><span>01 / THE GATHERING</span><span>MADE FOR YOUR NEXT CHAPTER</span></div>
        <div className="manifesto-grid"><h2>Where the<br /><em>next big thing</em><br />begins.</h2><div><p className="manifesto-copy">EventSpark brings campus culture and cutting-edge technology together in one unforgettable experience.</p><p>Get your hands dirty in a hackathon. Learn from people pushing boundaries. Find your crew, build something real and leave with momentum.</p><Link to="/about" className="inline-link">Discover EventSpark <ArrowUpRight size={16} /></Link></div></div>
        <div className="stat-row">{(festivalInfo?.stats || fallbackStats).map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
      </section>

      <section className="home-spotlight section-pad">
        <div className="spotlight-photo"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=80" alt="Creative team collaborating at a technology workshop" loading="lazy" /><span>MAKE. LEARN. FIND YOUR PEOPLE.</span></div>
        <div className="spotlight-copy"><p className="eyebrow"><span />A CAMPUS THAT COMES ALIVE</p><h2>More than an event.<br /><em>A feeling.</em></h2><p>From the first idea scribbled on a napkin to the final demo under the lights, this is your space to experiment, connect and surprise yourself.</p><div className="spotlight-links"><Link to="/schedule" className="inline-link">See the festival schedule <ArrowRight size={16} /></Link><Link to="/speakers" className="inline-link">Meet the voices <ArrowRight size={16} /></Link></div></div>
      </section>

      <section className="moments-section">
        <div className="section-pad moments-inner"><div className="section-heading"><div><p className="eyebrow"><span />03 / THE PEOPLE MAKE THE FESTIVAL</p><h2>Festival<br />highlights.</h2></div><Link to="/gallery" className="button button-outline">See past highlights <ArrowUpRight size={16} /></Link></div>
          <div className="moments-grid">{(festivalInfo?.highlights || fallbackHighlights).map((highlight) => <article className="moment-highlight" key={highlight.title}><img src={highlight.image} alt={highlight.title} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} /><span>{highlight.label}</span><div className="moment-highlight-copy"><h3>{highlight.title}</h3><p>{highlight.description}</p></div></article>)}</div>
        </div>
      </section>

      <section className="featured-section section-pad">
        <div className="section-heading"><div><p className="eyebrow"><span />04 / PICK YOUR PLAYGROUND</p><h2>Something for<br />every kind of curious.</h2></div><Link to="/events" className="button button-outline">All events <ArrowUpRight size={16} /></Link></div>
        {eventsError && <StatusMessage error={`Live events could not be loaded: ${eventsError}`} />}
        {events.length ? <div className="event-grid">{events.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : (
          <div className="feature-tiles">
            <Link to="/events" className="feature-tile tile-lavender"><span>01 / BUILD</span><Code2 /><h3>Hackathons &<br />designathons</h3><span>Find your next obsession <ArrowUpRight size={16} /></span></Link>
            <Link to="/events" className="feature-tile tile-peach"><span>02 / LEARN</span><Cpu /><h3>Workshops &<br />masterclasses</h3><span>Learn by doing <ArrowUpRight size={16} /></span></Link>
            <Link to="/events" className="feature-tile tile-mint"><span>03 / COMPETE</span><Zap /><h3>CTFs, robotics<br />& more</h3><span>Make some noise <ArrowUpRight size={16} /></span></Link>
          </div>
        )}
      </section>

      <section className="cta-band"><div className="cta-orb">✳</div><div><p className="eyebrow"><span />YOUR NEXT BIG THING STARTS HERE</p><h2>Bring your curiosity.<br /><i>We&apos;ll bring the sparks.</i></h2></div><Link to="/signup" className="button button-dark">Count me in <ArrowRight size={17} /></Link></section>
    </>
  );
}
