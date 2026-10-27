import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageIntro } from '../components/PageParts.jsx';

const gallery = [
  { title: 'Midnight build mode', place: 'HACKATHON / 2025', color: 'lavender', symbol: '⌘', image: 'photo-1519389950473-47ba0277781c' },
  { title: 'Ideas take shape', place: 'DESIGNATHON / 2025', color: 'peach', symbol: '✳', image: 'photo-1531482615713-2afd69097998' },
  { title: 'The room gets curious', place: 'AI LAB / 2025', color: 'mint', symbol: '◉', image: 'photo-1516321318423-f06f85e504b3' },
  { title: 'Small bot, big energy', place: 'ROBO RALLY / 2025', color: 'blue', symbol: '↗', image: 'photo-1485827404703-89b55fcc595e' },
  { title: 'Meet your people', place: 'COMMUNITY / 2025', color: 'peach', symbol: '∞', image: 'photo-1540575467063-178a50c2df87' },
  { title: 'Built, then shipped', place: 'DEMO DAY / 2025', color: 'lavender', symbol: '✦', image: 'photo-1516321497487-e288fb19713f' },
];
export default function GalleryPage() {
  return <section className="content-section section-pad"><PageIntro eyebrow="A LOOK BACK / 2025" title={<>A little proof<br /><em>of possibility.</em></>} description="The late nights, big laughs, ambitious prototypes, and people who made it all worth it." /><div className="gallery-grid">{gallery.map((item, index) => <article className={`gallery-card ${item.color}`} key={item.title}><div className="gallery-art"><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=80`} alt={item.title} loading="lazy" /><span>EVENTSPARK / 2025</span><b>{item.symbol}</b><small>0{index + 1}</small></div><div className="gallery-caption"><div><span>{item.place}</span><h3>{item.title}</h3></div><Sparkles size={17} /></div></article>)}</div><div className="gallery-note"><span>THIS IS JUST THE BEGINNING.</span><Link to="/events" className="inline-link">Be in the next one <ArrowRight size={16} /></Link></div></section>;
}
