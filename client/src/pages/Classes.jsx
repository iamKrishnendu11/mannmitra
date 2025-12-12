// src/pages/Classes.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Check, Clock, Award, Sparkles, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE;

const fallbackScreenshot = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Class+Image';

export default function Classes() {
  // ✅ FIX 1: Get 'accessToken' from useAuth()
  const { user, accessToken, progress, setProgress, createProgressForUser, refresh } = useAuth();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [completingClass, setCompletingClass] = useState(null);

  useEffect(() => {
    loadClasses();
    ensureProgressIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureProgressIfNeeded = async () => {
    if (progress) return;
    if (!user) {
      setProgress?.({
        _id: 'guest',
        user_email: 'guest@mannmitra.com',
        coins: 0,
        current_streak: 1,
        last_login_date: new Date().toISOString().split('T')[0],
        subscription_status: 'free',
        completed_classes: []
      });
      return;
    }
    try {
      const created = await createProgressForUser?.({
        user_email: user.email,
        coins: 0,
        current_streak: 1,
        last_login_date: new Date().toISOString().split('T')[0],
        subscription_status: 'free',
        completed_classes: []
      });
      setProgress?.(created);
    } catch (err) {
      console.error('ensure progress error', err);
    }
  };

  const loadClasses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/classes`);
      if (!res.ok) {
        throw new Error('Failed to load');
      }
      const data = await res.json();
      setClasses(data || []);
    } catch (error) {
      console.error('loadClasses error', error);
      toast.error('Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteClass = async (classIdRaw, coinsRewardFromClient) => {
    const classId = String(classIdRaw);
    const current = progress;
    if (!current) {
      toast.error('Progress not initialized yet');
      return;
    }

    const completedClasses = current.completed_classes || [];
    if (completedClasses.includes(classId)) {
      toast.info('You already completed this class!');
      return;
    }

    setCompletingClass(classId);
    try {
      // Guest handling (if no user is logged in)
      if ((!current._id || current._id === 'guest') && !user) {
        const guestUpdated = {
          ...current,
          completed_classes: [...completedClasses, classId],
          coins: (current.coins || 0) + (coinsRewardFromClient || 0)
        };
        setProgress?.(guestUpdated);
        toast.success(`Class completed! +${coinsRewardFromClient || 0} coins earned 🎉`);
        return;
      }

      // ✅ FIX 2: Use accessToken from useAuth, not localStorage manually
      const body = { classId };
      const res = await fetch(`${API_BASE}/api/progress/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(body)
      });

      const payload = await res.json();

      if (res.status === 200 || res.status === 201) {
        const updatedProgress = payload.progress;
        setProgress?.(updatedProgress);
        toast.success(`Class completed! +${ (updatedProgress.coins - (current.coins || 0)) || coinsRewardFromClient || 0 } coins earned 🎉`);
        await refresh?.();
      } else if (res.status === 401) {
        // Specific handle for 401 if token is still bad
        toast.error('Session expired. Please login again.');
      } else if (res.status === 400 && payload?.message === 'Class already completed') {
        setProgress?.(payload.progress || current);
        toast.info('You have already completed this class.');
      } else {
        toast.error(payload?.message || 'Failed to complete class');
      }
    } catch (error) {
      console.error('complete class error', error);
      toast.error('Failed to complete class');
    } finally {
      setCompletingClass(null);
    }
  };

  const filteredClasses = filterType === 'all' ? classes : classes.filter(c => c.type === filterType);

  const getTypeColor = (type) => {
    const colors = {
      yoga: 'from-purple-500 to-purple-600',
      meditation: 'from-blue-500 to-blue-600',
      breathing: 'from-green-500 to-green-600',
      mindfulness: 'from-pink-500 to-pink-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  // Block non-premium users
  if (progress?.subscription_status !== 'premium') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 flex items-center justify-center px-4">
        <Card className="rounded-3xl p-12 max-w-lg text-center border-4 border-purple-200">
          <Crown className="h-16 w-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Feature</h1>
          <p className="text-gray-600 text-lg mb-8">
            Upgrade to Premium to access yoga and meditation classes
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/Dashboard'}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 rounded-2xl"
          >
            Upgrade Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Award className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Premium Classes</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Yoga & Meditation</h1>
          <p className="text-gray-600 text-lg">Find your inner peace and earn coins</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <Tabs value={filterType} onValueChange={setFilterType} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-5 bg-white rounded-2xl p-2 shadow-sm">
              <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
              <TabsTrigger value="yoga" className="rounded-xl">Yoga</TabsTrigger>
              <TabsTrigger value="meditation" className="rounded-xl">Meditation</TabsTrigger>
              <TabsTrigger value="breathing" className="rounded-xl">Breathing</TabsTrigger>
              <TabsTrigger value="mindfulness" className="rounded-xl">Mindfulness</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Classes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <Card className="rounded-3xl p-12 text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes available</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItemRaw) => {
              const id = String(classItemRaw._id || classItemRaw.id);
              const classItem = { ...classItemRaw, id };
              const isCompleted = progress?.completed_classes?.includes(id);

              return (
                <Card key={id} className="rounded-3xl border-2 border-gray-100 hover:shadow-xl transition-all overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={classItem.thumbnail_url || fallbackScreenshot}
                      alt={classItem.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                         if (e.currentTarget.src !== fallbackScreenshot) {
                           e.currentTarget.src = fallbackScreenshot;
                         }
                      }}
                    />
                    
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getDifficultyColor(classItem.difficulty)} border-0`}>
                        {classItem.difficulty}
                      </Badge>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <Badge className={`bg-gradient-to-r ${getTypeColor(classItem.type)} text-white border-0 mb-3`}>
                      {classItem.type}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{classItem.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{classItem.description}</p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{classItem.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold text-purple-600">
                          +{classItem.coins_reward} coins
                        </span>
                      </div>
                    </div>

                    {classItem.instructor && (
                      <p className="text-xs text-gray-500 mb-4">
                        Instructor: {classItem.instructor}
                      </p>
                    )}

                    <Button
                      onClick={() => handleCompleteClass(id, classItem.coins_reward)}
                      disabled={isCompleted || completingClass === id}
                      className={`w-full rounded-2xl py-6 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                          : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                      }`}
                    >
                      {completingClass === id ? (
                        'Completing...'
                      ) : isCompleted ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Marked as Completed
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Start Class
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}