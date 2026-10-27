import { ArrowUpRight, Code2, GitBranch, Mail, Sparkles } from 'lucide-react';

const skills = ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JavaScript', 'Python', 'Full-Stack Architecture'];

export default function DeveloperPage() {
  return (
    <section className="content-section section-pad developer-page">
      <div className="developer-card glass-panel">
        <div className="developer-orb developer-orb-cyan" />
        <div className="developer-orb developer-orb-pink" />
        <div className="developer-card-top">
          <span className="developer-label"><Sparkles size={16} /> MEET THE CREATOR</span>
          <span className="developer-edition">EVENTSPARK / 2026</span>
        </div>
        <div className="developer-identity">
          <div className="developer-avatar" aria-hidden="true">AS</div>
          <div>
            <p className="profile-kicker">LEAD FULL-STACK DEVELOPER &amp; CREATOR OF EVENTSPARK</p>
            <h1>Arjita <em>Singh</em></h1>
            <p className="developer-student-id">STUDENT PRN <strong>25070521030</strong></p>
          </div>
        </div>
        <div className="developer-details">
          <article className="developer-detail-card">
            <span className="developer-detail-label">DEGREE &amp; BATCH</span>
            <h2>B.Tech in Computer Science and Engineering</h2>
            <p>Batch 2025–2029 · Section A</p>
          </article>
          <article className="developer-detail-card">
            <span className="developer-detail-label">INSTITUTION</span>
            <h2>Symbiosis Institute of Technology</h2>
            <p>Nagpur, Maharashtra, India</p>
          </article>
        </div>
        <div className="developer-skills">
          <div className="developer-section-title"><Code2 size={19} /><h2>Core skills &amp; tech stack</h2></div>
          <div className="developer-skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        <div className="developer-connect">
          <div><span className="developer-detail-label">LET&apos;S CONNECT</span><p>Have an idea or want to collaborate? Say hello.</p></div>
          <div className="developer-social-links">
            <a href="https://github.com/Arjitasingh13" target="_blank" rel="noreferrer"><GitBranch size={19} /> GitHub <ArrowUpRight size={15} /></a>
            <a href="mailto:arjitasingh13@gmail.com"><Mail size={19} /> Email <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
