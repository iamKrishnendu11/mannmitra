// src/components/UpgradeButtonInstant.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UpgradeButtonInstant({ className = '' }) {
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { refresh, accessToken, setProgress } = useAuth(); // grab setProgress

  const handleUpgrade = async () => {
    if (!confirm('This will instantly grant Premium access to your account. Continue?')) return;
    setLoading(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const res = await fetch(`${API}/api/payments/instant-upgrade`, {
        method: 'POST',
        credentials: 'include',
        headers
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Upgrade failed');

      // If server returned the updated progress, set it directly in context
      if (data?.progress) {
        setProgress(data.progress);     // immediate update (header will re-render)
      } else {
        // fallback: re-run refresh to get canonical user+progress
        await refresh?.();
      }

      // still call refresh to ensure tokens/user are up-to-date and other side effects run
      await refresh?.();

      alert('Upgraded to Premium! You now have access to Classes, Audio and Diary.');
    } catch (err) {
      console.error('instant upgrade error', err);
      alert(err.message || 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white ${className}`}
    >
      {loading ? 'Upgrading…' : 'Upgrade to Premium'}
    </button>
  );
}
