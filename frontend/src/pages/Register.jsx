import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      console.error('Register Error:', err);
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Gagal mendaftar akun baru.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center tracking-wider">BUAT AKUN BARU</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-400 text-xs rounded break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 text-neutral-400 uppercase font-bold">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-neutral-400 uppercase font-bold">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-neutral-400 uppercase font-bold">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white text-black font-bold rounded hover:bg-neutral-200 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'MEMPROSES...' : 'DAFTAR'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-neutral-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-white font-bold underline">
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}