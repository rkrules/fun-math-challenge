import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAuth } from '@/contexts/AuthContext';
import { migrateGuestHistory } from '@/utils/progressStore';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      migrateGuestHistory(user.id).finally(() => navigate('/'));
    }
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Signed in!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error('Google sign-in failed');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-sm bg-card border rounded-2xl p-6 shadow-lg space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-sm text-muted-foreground">
            Save your progress across devices
          </p>
        </div>

        <button
          onClick={google}
          disabled={busy}
          className="w-full border rounded-xl py-2.5 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 rounded-lg border bg-background"
          />
          <input
            type="password" required minLength={6} value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="w-full px-3 py-2 rounded-lg border bg-background"
          />
          <button
            type="submit" disabled={busy}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium disabled:opacity-50"
          >
            {mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {mode === 'signin' ? (
            <>No account? <button className="text-primary" onClick={() => setMode('signup')}>Sign up</button></>
          ) : (
            <>Have an account? <button className="text-primary" onClick={() => setMode('signin')}>Sign in</button></>
          )}
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            Continue as guest →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
