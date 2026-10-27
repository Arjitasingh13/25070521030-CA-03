import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth-context.js';
import { FormField, FormShell, StatusMessage } from '../components/PageParts.jsx';

export default function LoginPage() {
  const navigate = useNavigate(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { signIn } = useAuth();
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try { const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); signIn(data.user, data.token); const destination = location.state?.from; navigate(destination ? `${destination.pathname}${destination.search || ''}` : '/home', { replace: true }); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <FormShell className="login-page" eyebrow="WELCOME BACK" title={<>Good to see<br /><em>you again.</em></>} subtitle="Pick up where your curiosity left off." aside={<><Sparkles /><h2>Your next idea<br />is waiting.</h2><p>Sign in to save your spot and get back to the good stuff.</p><span>EVENTSPARK / 2026</span></>}><form className="login-form" onSubmit={submit}><StatusMessage error={error} /><FormField label="Email address"><input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></FormField><FormField label="Password"><input type="password" name="password" autoComplete="current-password" required minLength="6" placeholder="At least 6 characters" /></FormField><p className="form-switch recovery-link"><Link to="/forgot-password">Forgot password?</Link></p><button className="button button-dark full-width" disabled={loading}>{loading ? 'Signing you in...' : 'Sign in'} <ArrowRight size={17} /></button><p className="form-switch">New around here? <Link to="/signup">Create an account</Link></p></form></FormShell>;
}
