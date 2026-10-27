import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, KeyRound, MailCheck } from 'lucide-react';
import { apiRequest } from '../api.js';
import { FormField, FormShell, StatusMessage } from '../components/PageParts.jsx';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const isResetting = Boolean(token);

  async function requestReset(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccess(data.message);
      if (data.developmentResetToken) setToken(data.developmentResetToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword');
    if (newPassword !== formData.get('confirmPassword')) {
      setError('Your passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token, newPassword }),
      });
      setSuccess(data.message);
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      eyebrow={isResetting ? 'CHOOSE A NEW PASSWORD' : 'ACCOUNT RECOVERY'}
      title={isResetting ? <>A fresh start<br /><em>awaits.</em></> : <>Let’s get you<br /><em>back in.</em></>}
      subtitle={isResetting ? 'Choose a new password to secure your EventSpark account.' : 'We’ll help you get back to the events and ideas you love.'}
      aside={<><KeyRound /><h2>Your account,<br />secured.</h2><p>Recovery links are single-use and expire after 15 minutes.</p><span>EVENTSPARK / ACCOUNT SECURITY</span></>}
    >
      {!isResetting ? (
        <form onSubmit={requestReset}>
          <StatusMessage error={error} success={success} />
          <FormField label="Email address">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </FormField>
          <button className="button button-dark full-width" disabled={loading}>
            {loading ? 'Preparing recovery...' : 'Send recovery link'} <ArrowRight size={17} />
          </button>
          <p className="form-switch"><Link to="/login"><ArrowLeft size={14} /> Back to sign in</Link></p>
        </form>
      ) : (
        <form onSubmit={resetPassword}>
          <StatusMessage error={error} success={success} />
          {searchParams.get('token') ? (
            <p className="recovery-note"><MailCheck size={17} /> Reset link verified for <strong>{email}</strong></p>
          ) : (
            <>
              <p className="recovery-note"><MailCheck size={17} /> Development mode: enter a new password to finish recovery.</p>
              <FormField label="Recovery token">
                <input value={token} onChange={(event) => setToken(event.target.value)} required autoComplete="one-time-code" />
              </FormField>
            </>
          )}
          <FormField label="New password">
            <input type="password" name="newPassword" autoComplete="new-password" required minLength="8" maxLength="72" placeholder="At least 8 characters" />
          </FormField>
          <FormField label="Confirm new password">
            <input type="password" name="confirmPassword" autoComplete="new-password" required minLength="8" maxLength="72" placeholder="Enter your new password again" />
          </FormField>
          <button className="button button-dark full-width" disabled={loading}>
            {loading ? 'Updating password...' : 'Update password'} <ArrowRight size={17} />
          </button>
          {success.startsWith('Password updated') && <p className="form-switch">Taking you to sign in...</p>}
        </form>
      )}
    </FormShell>
  );
}
