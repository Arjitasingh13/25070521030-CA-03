import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, Cpu, Sparkles, Users } from 'lucide-react';
import { getFestivalInfo } from '../api.js';
import { PageIntro, StatusMessage } from '../components/PageParts.jsx';
import { fallbackStats } from '../utils/festivalData.js';

export default function AboutPage() {
  const [festivalInfo, setFestivalInfo] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getFestivalInfo()
      .then((data) => { if (active) setFestivalInfo(data.info); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  const icons = [Users, Sparkles, ArrowUpRight, Code2];
  const defaultPillars = [
    { number: '01', title: 'Innovation first', description: 'Give ambitious ideas the tools, mentors, and space to become something real.', icon: Sparkles },
    { number: '02', title: 'Hands-on learning', description: 'Learn by building, experimenting, asking questions, and sharing what works.', icon: Code2 },
    { number: '03', title: 'Inclusive community', description: 'Bring different disciplines and experience levels together around curiosity.', icon: Users },
    { number: '04', title: 'Future tech', description: 'Explore emerging technology and the people shaping how it can be used.', icon: Cpu },
  ];
  const pillars = festivalInfo?.highlights?.length
    ? festivalInfo.highlights.map((highlight, index) => ({
        ...highlight,
        number: String(index + 1).padStart(2, '0'),
        icon: defaultPillars[index % defaultPillars.length].icon,
      }))
    : defaultPillars;
  const journey = [
    { step: '01', title: 'A campus idea', description: 'A simple thought takes shape: create a place where curious people can build together.' },
    { step: '02', title: 'More minds join', description: 'Students, makers, mentors, and communities bring new disciplines into the conversation.' },
    { step: '03', title: 'The doors open wider', description: 'The gathering grows beyond one room, welcoming participants from across the country.' },
    { step: '04', title: 'EventSpark 2026', description: 'Three days of workshops, events, ideas, and connections mark the next chapter.' },
  ];

  return (
    <div className="about-page">
      <section className="about-hero section-pad">
        <PageIntro eyebrow="THE IDEA BEHIND THE SPARK" title={<>Curiosity<br />is our <em>campus.</em></>} description={festivalInfo?.description || 'EventSpark is an independent student festival built around a simple idea: the future belongs to the people who show up and make it.'} />
        <StatusMessage error={error && `${error} Check that the EventSpark server and MongoDB are running.`} />
        <div className="about-photo">
          <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1700&q=85" alt="University students gathering on campus" />
          <span>BUILT BY STUDENTS. OPEN TO EVERYONE.</span>
        </div>
      </section>

      <section className="about-stats section-pad" aria-label="EventSpark impact">
        <div className="about-section-heading">
          <p className="eyebrow"><span />THE SPARK IN NUMBERS</p>
          <h2>Big energy.<br /><em>Real momentum.</em></h2>
        </div>
        <div className="about-stats-grid">
          {(festivalInfo?.stats?.length ? festivalInfo.stats : fallbackStats).map(({ value, label }, index) => {
            const Icon = icons[index % icons.length];
            return (
            <article className="about-stat-card" key={label}>
              <Icon aria-hidden="true" />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
            );
          })}
        </div>
      </section>

      <section className="about-pillars section-pad">
        <div className="about-section-heading about-pillars-heading">
          <p className="eyebrow"><span />OUR POINT OF VIEW</p>
          <h2>Big ideas need<br /><em>open doors.</em></h2>
          <p>We bring curious people together across disciplines to turn “what if?” into “we did.”</p>
        </div>
        <div className="about-pillar-grid">
          {pillars.map(({ number, title, description, icon: Icon }) => (
            <article className="about-pillar-card" key={number}>
              <div className="about-pillar-top"><span>{number} / 04</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="about-pillar-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="about-journey section-pad">
        <div className="about-section-heading">
          <p className="eyebrow"><span />FROM FIRST THOUGHT TO FESTIVAL</p>
          <h2>The EventSpark<br /><em>journey.</em></h2>
        </div>
        <div className="about-timeline">
          {journey.map((moment) => (
            <article className="about-timeline-item" key={moment.step}>
              <span className="about-timeline-marker">{moment.step}</span>
              <div><h3>{moment.title}</h3><p>{moment.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Come curious.<br /><em>Leave inspired.</em></h2>
        <Link to="/events" className="button button-dark">Find your event <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}
