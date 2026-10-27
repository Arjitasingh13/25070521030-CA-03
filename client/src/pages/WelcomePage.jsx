import { ArrowRight, Cpu, Radio, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const highlights = [
  { icon: <Cpu size={18} />, label: 'BUILD WHAT’S NEXT' },
  { icon: <Zap size={18} />, label: 'MEET YOUR PEOPLE' },
  { icon: <Radio size={18} />, label: 'NOV 20—22 · 2026' },
];

export default function WelcomePage() {
  return (
    <section className="welcome-page" aria-labelledby="welcome-heading">
      <div className="welcome-grid-glow" />
      <div className="welcome-copy">
        <span className="welcome-edition"><Sparkles size={16} /> THE FUTURE IS A GROUP PROJECT</span>
        <p className="welcome-eyebrow">INDIA&apos;S ULTIMATE TECH FEST</p>
        <h1 id="welcome-heading">Welcome to<br /><span>EventSpark</span><b>2026</b></h1>
        <p className="welcome-description">
          Three electric days of technology, imagination and people who can&apos;t wait to make something matter.
          Come curious. Leave inspired.
        </p>
        <div className="welcome-actions">
          <Link to="/signin" className="welcome-enter">Get started <ArrowRight size={20} /></Link>
          <Link to="/signup" className="welcome-explore">Create your account</Link>
        </div>
        <div className="welcome-highlights">
          {highlights.map((item) => (
            <span key={item.label}>{item.icon}{item.label}</span>
          ))}
        </div>
      </div>
      <div className="welcome-art">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1300&q=85"
          alt="A live technology festival filled with curious people and bright ideas"
          fetchPriority="high"
        />
        <div className="welcome-art-overlay" />
        <div className="welcome-art-ring ring-one" />
        <div className="welcome-art-ring ring-two" />
        <div className="welcome-image-label"><span>01 — 03</span><b>MAKE SOME<br />FUTURE.</b><small>YOUR NEXT CHAPTER STARTS HERE</small></div>
        <span className="welcome-image-stamp"><Sparkles size={16} /> EVENTSPARK / INDIA</span>
      </div>
      <div className="welcome-scroll"><span>SCROLL INTO SOMETHING BIGGER</span><span className="scroll-line" /></div>
    </section>
  );
}
