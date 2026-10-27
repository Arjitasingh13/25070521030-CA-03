import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getSponsors } from '../api.js';
import { PageIntro, StatusMessage } from '../components/PageParts.jsx';
import { fallbackSponsors } from '../utils/festivalData.js';

const tiers = ['Title Sponsor', 'Tech Partner', 'Media Partner', 'Community Partner'];

function SponsorLogo({ sponsor }) {
  const [imageFailed, setImageFailed] = useState(false);

  return sponsor.logoUrl && !imageFailed
    ? <img className="sponsor-logo" src={sponsor.logoUrl} alt={`${sponsor.name} logo`} loading="lazy" onError={() => setImageFailed(true)} />
    : <span className="sponsor-logo-fallback" aria-label={`${sponsor.name} logo`} style={{ '--partner-color': sponsor.brandColor }}>{sponsor.logoText || sponsor.name.slice(0, 2).toUpperCase()}</span>;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState(fallbackSponsors);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getSponsors()
      .then((data) => { if (active && data.sponsors?.length) setSponsors(data.sponsors); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  return <section className="content-section section-pad"><PageIntro eyebrow="THE PEOPLE BEHIND THE SPARK" title={<>Good ideas<br /><em>have allies.</em></>} description="Meet the teams helping make room for curious minds to build, learn, and connect." /><p className="partner-sample-note">Illustrative sample partners for this demo — not confirmed EventSpark sponsors.</p><StatusMessage error={error && `Showing sample partners because live data could not be loaded: ${error}`} /><div className="sponsor-tier-list">{tiers.map((tier) => {
    const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier);
    if (!tierSponsors.length) return null;
    return <section className="sponsor-tier" key={tier} aria-labelledby={`sponsor-tier-${tier.replaceAll(' ', '-').toLowerCase()}`}><h2 id={`sponsor-tier-${tier.replaceAll(' ', '-').toLowerCase()}`}>{tier}</h2><div className="sponsor-grid">{tierSponsors.map((sponsor) => <a className="sponsor-card" href={sponsor.website} key={sponsor._id || sponsor.name} target="_blank" rel="noreferrer"><span className="sponsor-category">{sponsor.tier}</span><div className="sponsor-logo-wrap"><SponsorLogo sponsor={sponsor} /></div><strong className="sponsor-name">{sponsor.name}</strong><p>{sponsor.description}</p><span className="sponsor-website">Visit website <ArrowUpRight size={15} /></span></a>)}</div></section>;
  })}</div><div className="sponsor-cta"><h2>Want to make an impact?</h2><p>Let&apos;s put your brand in the room where the next big thing begins.</p><Link to="/contact" className="inline-link">Become a partner <ArrowUpRight size={16} /></Link></div></section>;
}
