import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Gagal login. Periksa email/password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-mono text-white">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center tracking-wider">MASUK KE AKUN</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-400 text-xs rounded break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 text-neutral-400 uppercase font-bold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-neutral-400 uppercase font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white text-black font-bold rounded hover:bg-neutral-200 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'MEMPROSES...' : 'LOG IN'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-neutral-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-white font-bold underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}