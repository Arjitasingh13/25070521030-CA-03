import { useState } from 'react';
import { ArrowRight, Clock3, MapPin } from 'lucide-react';
import { apiRequest } from '../api.js';
import { FormField, PageIntro, StatusMessage } from '../components/PageParts.jsx';

export default function ContactPage() {
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    const form = event.currentTarget;
    try { const data = await apiRequest('/contact', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) }); setSuccess(data.message); form.reset(); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <section className="contact-section section-pad"><div className="contact-grid"><div><PageIntro eyebrow="WE'RE ALL EARS" title={<>Have a<br /><em>good one?</em></>} description="A question, an idea, a partnership pitch, or just want to say hi? Our human helpdesk is right here." /><div className="contact-details"><span><MapPin /> Bengaluru, Karnataka, India</span><span><Clock3 /> Usually reply within one working day</span></div></div><div className="contact-form-card"><h2>Drop us a note.</h2><p>We&apos;ll get back to you as soon as we can.</p><form onSubmit={submit}><StatusMessage error={error} success={success} /><FormField label="Your name"><input name="name" required placeholder="What should we call you?" /></FormField><FormField label="Email address"><input type="email" name="email" required placeholder="Where can we reply?" /></FormField><FormField label="What's this about?"><input name="subject" required placeholder="A quick subject line" /></FormField><FormField label="Your message"><textarea name="message" rows="5" required placeholder="Tell us what’s on your mind..." /></FormField><button className="button button-dark full-width" disabled={loading}>{loading ? 'Sending your note...' : 'Send your message'} <ArrowRight size={17} /></button></form></div></div></section>;
}
