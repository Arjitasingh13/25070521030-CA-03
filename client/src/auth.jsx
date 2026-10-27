import { useMemo, useState } from 'react';
import { AuthContext } from './auth-context.js';

const USER_KEY = 'eventspark-user';
const TOKEN_KEY = 'eventspark-token';
function readStoredSession() {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    const token = localStorage.getItem(TOKEN_KEY);
    return user && token ? { user, token } : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  function signIn(user, token) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    setSession({ user, token });
  }

  function signOut() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setSession({ user: null, token: null });
  }

  const value = useMemo(
    () => ({ user: session.user, token: session.token, isAuthenticated: Boolean(session.user && session.token), signIn, signOut }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
