// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles, Flame, Gift, TrendingUp, Award,
  Crown, Heart, Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import CoinHistoryModal from '../components/CoinHistoryModal';

export default function Dashboard() {
  const {
    user,
    progress: contextProgress,
    loading: authLoading,
    refresh: authRefresh,
    updateProgress: contextUpdateProgress,
    createProgressForUser,
    setProgress: setContextProgress
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [localProgress, setLocalProgress] = useState(contextProgress || null);
  
  // State for the History Modal
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setLocalProgress(contextProgress || null);
  }, [contextProgress]);

  const API_BASE = import.meta.env.VITE_BASE_URL || '';

  const fetchProgressFromServer = useCallback(async (signal) => {
    if (!user?.email) return null;

    const encodedEmail = encodeURIComponent(user.email);
    const tryUrls = [
      `${API_BASE}/progress?user_email=${encodedEmail}`,
      `${API_BASE}/userProgress?user_email=${encodedEmail}`,
      `${API_BASE}/api/progress?user_email=${encodedEmail}`,
      `${API_BASE}/api/userProgress?user_email=${encodedEmail}`,
      `${API_BASE.replace(/\/api\/?$/,'')}/api/progress?user_email=${encodedEmail}`,
    ].map(u => u.replace(/([^:]\/)\/+/g, '$1'));

    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'GET', signal, credentials: 'include' });
        if (!res.ok) {
          if (res.status === 404) continue;
          const text = await res.text().catch(() => '');
          throw new Error(`Fetch failed: ${res.status} ${text}`);
        }
        const data = await res.json();
        setContextProgress?.(data);
        setLocalProgress(data);
        setError(null);
        return data;
      } catch (err) {
        if (err.name === 'AbortError') return null;
        console.error('attempt to fetch', url, 'failed:', err);
        continue;
      }
    }
    setError('Failed to fetch progress. Try reloading.');
    return null;
  }, [API_BASE, user?.email, setContextProgress]);

  useEffect(() => {
    let ctrl = new AbortController();
    (async () => {
      if (!authLoading) {
        setLoading(true);
        try {
          await fetchProgressFromServer(ctrl.signal);
        } finally {
          setLoading(false);
        }
      }
    })();
    return () => ctrl.abort();
  }, [authLoading, fetchProgressFromServer]);

  const ensureProgress = async () => {
    if (localProgress && localProgress._id && localProgress._id !== 'guest') return localProgress;

    const defaultData = {
      coins: 0,
      current_streak: 0,
      last_login_date: new Date().toISOString(),
      subscription_status: 'free',
      completed_classes: []
    };

    if (!user?.email) {
      const guest = { ...defaultData, _id: 'guest', user_email: 'guest@mannmitra.com' };
      setContextProgress?.(guest);
      setLocalProgress(guest);
      return guest;
    }

    try {
      const created = await createProgressForUser?.({ ...defaultData, user_email: user.email });
      setContextProgress?.(created);
      setLocalProgress(created);
      return created;
    } catch (err) {
      console.error('ensureProgress error', err);
      const fallback = { ...defaultData, _id: 'guest', user_email: user.email };
      setContextProgress?.(fallback);
      setLocalProgress(fallback);
      return fallback;
    }
  };

  const handleUpgradeToPremium = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const current = await ensureProgress();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const updatePayload = {
        subscription_status: 'premium',
        subscription_end_date: endDate.toISOString()
      };

      const optimistic = { ...current, ...updatePayload };
      setContextProgress?.(optimistic);
      setLocalProgress(optimistic);

      if (typeof contextUpdateProgress === 'function' && current?._id && current._id !== 'guest') {
        await contextUpdateProgress(updatePayload);
      } else if (current?._id && current._id !== 'guest') {
        const url = `${API_BASE}/progress/${current._id}`.replace(/([^:]\/)\/+/g, '$1');
        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      } else {
        const url = `${API_BASE}/progress`.replace(/([^:]\/)\/+/g, '$1');
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ user_email: user.email, ...optimistic })
        });
      }

      await authRefresh?.();
      await fetchProgressFromServer();
      toast.success('Upgraded to Premium! 🎉');
    } catch (err) {
      console.error('Upgrade error', err);
      toast.error('Failed to upgrade to premium.');
      await fetchProgressFromServer();
    } finally {
      setBusy(false);
    }
  };

  const isPremium = (localProgress?.subscription_status === 'premium');

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name?.split?.(' ')[0] || 'Guest'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's your wellness journey overview</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Total Coins Card */}
          <div 
            onClick={() => setShowHistory(true)} 
            className="cursor-pointer group"
          >
            <Card className="rounded-3xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all h-full">
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {localProgress?.coins ?? 0}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">Total Coins</h3>
                <p className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>{isPremium ? 'Keep earning!' : 'Upgrade to earn coins'}</span>
                  <span className="text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    View History &rarr;
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  {localProgress?.current_streak ?? 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Day Streak</h3>
              <p className="text-xs text-gray-500 mt-1">Login daily to maintain</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {localProgress?.completed_classes?.length ?? 0}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Classes Done</h3>
              <p className="text-xs text-gray-500 mt-1">{isPremium ? 'Great progress!' : 'Premium feature'}</p>
            </CardContent>
          </Card>
        </div>

        {!isPremium ? (
          <Card className="rounded-3xl border-4 border-purple-200 bg-gradient-to-r from-purple-100 via-purple-50 to-pink-50 mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-8 w-8 text-purple-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Upgrade to Premium</h2>
                  </div>
                  <p className="text-gray-700 text-lg mb-4">Unlock personal therapist, private diary, relaxation audio, yoga classes, and start earning coins!</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Therapist Access', 'Private Diary', 'Audio Library', 'Yoga Classes', 'Earn Coins'].map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-purple-700 border border-purple-200">✓ {feature}</span>
                    ))}
                  </div>
                  <Button onClick={handleUpgradeToPremium} size="lg" disabled={busy} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg rounded-2xl shadow-lg">
                    {busy ? 'Upgrading…' : 'Upgrade Now - ₹449/month'}<Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-4 border-purple-300 bg-gradient-to-r from-purple-600 to-purple-800 text-white mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Premium Member</h2>
              </div>
              <p className="text-purple-100 text-lg mb-4">You have full access to all MannMitra features! Keep up the great work on your wellness journey.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">Valid until: {localProgress?.subscription_end_date ? new Date(localProgress.subscription_end_date).toLocaleDateString() : '—'}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to={createPageUrl('Chatbot')} className="group">
            <Card className="rounded-3xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all p-6 h-full">
              <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Heart className="h-6 w-6 text-purple-600" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chat Now</h3>
              <p className="text-sm text-gray-600">Talk with our AI companion</p>
            </Card>
          </Link>

          <Link to={createPageUrl('Community')} className="group">
            <Card className="rounded-3xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all p-6 h-full">
              <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><TrendingUp className="h-6 w-6 text-blue-600" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">Share your story</p>
            </Card>
          </Link>

          {isPremium && (
            <>
              <Link to={createPageUrl('Classes')} className="group">
                <Card className="rounded-3xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all p-6 h-full">
                  <div className="h-12 w-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Award className="h-6 w-6 text-green-600" /></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Classes</h3>
                  <p className="text-sm text-gray-600">Yoga & meditation</p>
                </Card>
              </Link>

              <Link to={createPageUrl('Rewards')} className="group">
                <Card className="rounded-3xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all p-6 h-full">
                  <div className="h-12 w-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Gift className="h-6 w-6 text-pink-600" /></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Rewards</h3>
                  <p className="text-sm text-gray-600">Redeem your coins</p>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* RENDER THE MODAL AT THE BOTTOM */}
      <CoinHistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={localProgress?.history || []} 
      />
    </div>
  );
}