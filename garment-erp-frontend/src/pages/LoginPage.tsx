import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@garmenterp.com');
  const [password, setPassword] = useState('Admin@123');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch {
      // error shown below
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 bg-blueprint bg-grid p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 font-mono text-2xl font-bold text-ink-950 shadow-glow">
            L
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-wide text-slate-900 dark:text-slate-50">LOOMLINE ERP</h1>
          <p className="mt-1 text-sm text-slate-400">Garment Manufacturing Control Center</p>
        </div>

        <form onSubmit={onSubmit} className="panel space-y-4 p-6">
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-400 ring-1 ring-rose-500/30">
              Invalid email or password.
            </p>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-slate-500">
            Demo: <span className="font-mono text-slate-400">admin@garmenterp.com / Admin@123</span> (run backend seed script)
          </p>
        </form>
      </div>
    </div>
  );
}
