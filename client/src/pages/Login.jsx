import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signin({ email: form.email, password: form.password });
      if (res?.accessToken) {
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Login failed');
      }
    } catch (err) {
      setError(err?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Sign in to MannMitra</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            className="mt-1 block w-full p-3 border rounded-lg"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            className="mt-1 block w-full p-3 border rounded-lg"
            placeholder="••••••••"
          />
        </label>

        {error && <div className="text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:opacity-95"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Don’t have an account? <a href="/register" className="text-purple-600 font-medium">Create one</a>
      </p>
    </div>
  );
}
