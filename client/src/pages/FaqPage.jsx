import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { PageIntro } from '../components/PageParts.jsx';

const questions = [
  ['Who can attend EventSpark?', 'Curious students, builders, designers, educators and technology fans are welcome. Some individual events may have their own team or experience requirements.'],
  ['When and where is the festival?', 'EventSpark runs November 20–22, 2026, at the IIT Bombay campus in Powai, Mumbai. Check the schedule for the latest event timings and spaces.'],
  ['How do I register for an event?', 'Browse the events catalog, open an event you like and choose “Save your spot.” Fill in the registration form to send your booking to the EventSpark team.'],
  ['Do I need a team to join?', 'Not always. Many workshops and sessions welcome individuals, and team size depends on the event. Check the event details or contact the helpdesk if you are unsure.'],
  ['Is there a fee to attend?', 'Pass availability and any event-specific costs will be announced with the festival registration information. Contact the helpdesk for accessibility or payment questions.'],
  ['I want to host or sponsor something. Who should I contact?', 'We would love to hear from you. Use the contact form and choose a subject that describes your idea; our team will follow up.'],
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return <section className="content-section section-pad"><PageIntro eyebrow="A FEW THINGS YOU MIGHT BE WONDERING" title={<>Good questions.<br /><em>Clear answers.</em></>} description="Still curious? We’re listening. If you don’t find what you need here, our helpdesk is one click away." /><div className="faq-layout"><div className="faq-list">{questions.map(([question, answer], index) => <article className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><span className="faq-toggle">{open === index ? '−' : '+'}</span></button>{open === index && <p>{answer}</p>}</article>)}</div><aside className="faq-aside"><Sparkles /><h2>Still have<br />a question?</h2><p>A real person from our festival team would be happy to help.</p><Link to="/contact" className="inline-link">Talk to the helpdesk <ArrowUpRight size={15} /></Link></aside></div></section>;
}
