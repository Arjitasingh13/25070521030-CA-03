import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth-context.js';
import { FormField, FormShell, StatusMessage } from '../components/PageParts.jsx';

export default function SignupPage() {
  const navigate = useNavigate(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try { const data = await apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); signIn(data.user, data.token); navigate('/home'); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <FormShell eyebrow="JOIN THE GATHERING" title={<>Make yourself<br /><em>at home.</em></>} subtitle="One account. A whole lot of possibility." aside={<><Users /><h2>Good things<br />happen together.</h2><p>Meet your people, make something matter, and take the first step.</p><span>YOUR PEOPLE ARE HERE</span></>}><form onSubmit={submit}><StatusMessage error={error} /><FormField label="Your name"><input name="name" autoComplete="name" required minLength="2" placeholder="Ada Lovelace" /></FormField><FormField label="Email address"><input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></FormField><FormField label="Password"><input type="password" name="password" autoComplete="new-password" required minLength="6" placeholder="At least 6 characters" /></FormField><button className="button button-dark full-width" disabled={loading}>{loading ? 'Creating your account...' : 'Create account'} <ArrowRight size={17} /></button><p className="form-switch">Already with us? <Link to="/login">Sign in</Link></p></form></FormShell>;
}
