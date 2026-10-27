import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getSpeakers } from '../api.js';
import { PageIntro, StatusMessage } from '../components/PageParts.jsx';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getSpeakers()
      .then((data) => { if (active) setSpeakers(data.speakers || []); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const tones = ['lavender', 'peach', 'mint', 'blue'];

  return <section className="content-section section-pad"><PageIntro eyebrow="PEOPLE WITH SOMETHING TO SHARE" title={<>Fresh ideas.<br /><em>Real voices.</em></>} description="Meet the builders, researchers and creative thinkers bringing their experience, questions and honest stories to the festival." /><StatusMessage error={error && `${error} Check that the EventSpark server and MongoDB are running.`} />{loading ? <div className="loading-state">Loading festival speakers...</div> : speakers.length ? <div className="speaker-grid">{speakers.map((speaker, index) => <article className="speaker-card" key={speaker._id || speaker.name}><div className={`speaker-portrait ${tones[index % tones.length]}`}><img src={speaker.avatar} alt={`${speaker.name}, EventSpark guest speaker`} loading="lazy" /><span>EVENTSPARK / 2026</span></div><p className="speaker-role">{speaker.role}</p><h2>{speaker.name}</h2><p className="speaker-topic">“{speaker.topic}”</p><p className="speaker-bio">{speaker.bio}</p></article>)}</div> : !error ? <p className="empty-state">Speaker announcements are coming soon.</p> : null}<p className="speakers-note">More voices and sessions will be announced soon. <Link to="/schedule">Explore the schedule <ArrowRight size={15} /></Link></p></section>;
}
