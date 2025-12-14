// src/pages/Audio.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Clock, Sparkles, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const DEV_IMAGE_URL = '/mnt/data/Screenshot 2025-11-22 022719.png';

export default function Audio() {
  const { user, accessToken, progress, setProgress, createProgressForUser, updateProgress, refresh } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [playingId, setPlayingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const playedOnceRef = useRef(new Set()); // track ids that already rewarded

  useEffect(() => {
    loadTracks();
    // cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
    // eslint-disable-next-line
  }, []);

  const headers = () => accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const loadTracks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/audio?limit=100`, { headers: { ...headers() } });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setTracks(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load audio tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const canPlayTrack = (track) => {
    if (!track.is_premium) return true;
    if (progress?.subscription_status === 'premium') return true;
    return false;
  };

  const handlePlayPause = async (track) => {
    // if premium and user not premium -> show upgrade
    if (track.is_premium && progress?.subscription_status !== 'premium') {
      toast.error('Upgrade to premium to play this audio');
      return;
    }

    // same track toggling
    if (playingId === track._id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => console.error('play error', err));
        setIsPlaying(true);
      }
      return;
    }

    // switching tracks
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    setPlayingId(track._id);
    setIsPlaying(false);

    // create audio element and play
    const audio = new Audio(track.audio_url);
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      // when a track finishes, reward coins if not rewarded before
      rewardCoinsForTrack(track);
    });

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    // if you want to track time/progress you can add "timeupdate" listener
    try {
      await audio.play();
      setIsPlaying(true);
      // we'll award after 10 seconds as example if not already awarded
      const awardTimeout = setTimeout(() => {
        rewardCoinsForTrack(track);
      }, 10000);
      // clear if track ended sooner
      audio.addEventListener('ended', () => clearTimeout(awardTimeout));
    } catch (err) {
      console.error('Audio play failed', err);
      toast.error('Playback failed');
      setPlayingId(null);
      setIsPlaying(false);
    }
  };

  const rewardCoinsForTrack = async (track) => {
    // avoid awarding multiple times in same session
    if (!track.coins_reward || playedOnceRef.current.has(track._id)) return;
    playedOnceRef.current.add(track._id);
    // update progress if available
    try {
      if (typeof updateProgress === 'function' && progress) {
        if (progress._id && progress._id !== 'guest') {
          const updated = await updateProgress({
            coins: (progress.coins || 0) + (track.coins_reward || 0),
            diary_entries_count: progress.diary_entries_count
          });
          setProgress?.(updated);
        } else if (progress._id === 'guest' && user) {
          const created = await createProgressForUser?.({
            user_email: user.email,
            coins: (progress.coins || 0) + (track.coins_reward || 0),
            current_streak: progress.current_streak || 1,
            last_login_date: progress.last_login_date || new Date().toISOString().split('T')[0],
            subscription_status: progress.subscription_status || 'free'
          });
          setProgress?.(created);
        } else {
          setProgress?.({ ...(progress || {}), coins: (progress?.coins || 0) + (track.coins_reward || 0) });
        }
      }
      toast.success(`+${track.coins_reward || 0} coins for listening`);
      await refresh?.();
    } catch (err) {
      console.error('reward error', err);
    }
  };

  const handleLike = async (track) => {
    if (!accessToken) {
      toast.error('Please sign in to like');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/audio/${track._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers() }
      });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setTracks(t => t.map(x => x._id === track._id ? { ...x, likes: json.likes } : x));
    } catch (err) {
      console.error(err);
      toast.error('Failed to like');
    }
  };

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const filtered = tracks.filter(t => filterType === 'all' ? true : (t.tags || []).includes(filterType));

  

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Relaxation Audio</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Audio Library</h1>
          <p className="text-gray-600 text-lg">Soothing meditations & soundscapes</p>
        </div>

        {/* Filter tabs / tags */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center">
            <button className={`px-4 py-2 rounded-full ${filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-white'}`} onClick={() => handleFilter('all')}>All</button>
            <button className={`px-4 py-2 rounded-full ${filterType === 'sleep' ? 'bg-purple-600 text-white' : 'bg-white'}`} onClick={() => handleFilter('sleep')}>Sleep</button>
            <button className={`px-4 py-2 rounded-full ${filterType === 'focus' ? 'bg-purple-600 text-white' : 'bg-white'}`} onClick={() => handleFilter('focus')}>Focus</button>
            <button className={`px-4 py-2 rounded-full ${filterType === 'nature' ? 'bg-purple-600 text-white' : 'bg-white'}`} onClick={() => handleFilter('nature')}>Nature</button>
            <button className={`px-4 py-2 rounded-full ${filterType === 'meditation' ? 'bg-purple-600 text-white' : 'bg-white'}`} onClick={() => handleFilter('meditation')}>Meditation</button>
          </div>
        </div>

        {/* Tracks Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
            <p className="text-gray-600 mt-4">Loading audio...</p>
          </div>
        ) : filtered.length === 0 ? (
          <Card className="rounded-3xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No audio available</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <Card key={t._id} className="rounded-3xl border-2 border-gray-100 hover:shadow-xl transition-all p-4">
                <div className="relative rounded-xl overflow-hidden h-44 mb-4 bg-gray-100">
                  <img src={t.thumbnail_url || DEV_IMAGE_URL} alt={t.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 mb-2">{t.type || 'audio'}</Badge>
                    <h3 className="text-lg font-bold text-gray-900">{t.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{t.description}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">{t.duration_minutes || Math.round((t.duration_seconds || 0) / 60)} min</div>
                    <div className="text-purple-600 font-semibold mb-3">+{t.coins_reward || 0} coins</div>

                    {t.is_premium && progress?.subscription_status !== 'premium' ? (
                      <Button onClick={() => window.location.href = '/Dashboard'} className="rounded-2xl py-2 bg-yellow-500 text-white">Upgrade</Button>
                    ) : (
                      <Button onClick={() => handlePlayPause(t)} className="rounded-2xl py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        {playingId === t._id && isPlaying ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Play</>}
                      </Button>
                    )}
                    <div className="mt-2 flex items-center gap-2 justify-end">
                      <button onClick={() => handleLike(t)} className="flex items-center gap-2 text-gray-700">
                        <svg className={`h-5 w-5 ${t.likes > 0 ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none">
                          <path d="M12 21s-7-4.35-9.5-7.04C-1 11.01 3 5 7.5 5 10 5 12 7 12 7s2-2 4.5-2C21 5 25 11.01 21.5 13.96 19 16.65 12 21 12 21z" />
                        </svg>
                        <span className="text-sm">{t.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
