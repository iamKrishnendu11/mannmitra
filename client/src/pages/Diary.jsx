// src/pages/Diary.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Plus, Calendar, Smile, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

// DEV helper image (local path you uploaded) — remove for production
const DEV_IMAGE_URL = '/mnt/data/Screenshot 2025-11-22 012601.png';

export default function Diary() {
  // NOTE: use accessToken (AuthContext must expose accessToken)
  const { user, accessToken, progress, setProgress, createProgressForUser, updateProgress, refresh } = useAuth();

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'calm',
    entry_date: new Date().toISOString().split('T')[0],
    gratitude_items: []
  });
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  // Vite env (must start with VITE_)
  const API_BASE = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line
  }, []);

  const getAuthHeader = () => {
    const t = accessToken;
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  // ensureLoggedIn optionally redirects; default: no redirect
  const ensureLoggedIn = (redirect = false) => {
    if (!accessToken) {
      if (redirect) {
        toast.error('Not logged in — please sign in.');
        setTimeout(() => { window.location.href = '/login'; }, 600);
      }
      return false;
    }
    return true;
  };

  // loadEntries: do NOT redirect if not logged in — just skip loading
  const loadEntries = async () => {
    setIsLoading(true);
    try {
      if (!ensureLoggedIn(false)) {
        setEntries([]);
        setIsLoading(false);
        return;
      }

      const headers = { ...getAuthHeader() };
      const url = `${API_BASE}/api/diary?limit=100`;
      console.log('loadEntries url:', url);
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('loadEntries failed:', res.status, text);
        throw new Error('Failed to fetch diary entries');
      }
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('loadEntries error', err);
      toast.error('Failed to load diary entries');
    } finally {
      setIsLoading(false);
    }
  };

  const openNewEntryDialog = (entry = null) => {
    if (entry) {
      setEditingEntry(entry);
      setNewEntry({
        title: entry.title || '',
        content: entry.content || '',
        mood: entry.mood || 'calm',
        entry_date: entry.entry_date ? new Date(entry.entry_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        gratitude_items: entry.gratitude_items || []
      });
    } else {
      setEditingEntry(null);
      setNewEntry({
        title: '',
        content: '',
        mood: 'calm',
        entry_date: new Date().toISOString().split('T')[0],
        gratitude_items: []
      });
      setAudioFile(null);
      setGratitudeInput('');
    }
    setShowNewEntry(true);
  };

  const handleAddGratitude = () => {
    if (gratitudeInput.trim()) {
      setNewEntry({
        ...newEntry,
        gratitude_items: [...newEntry.gratitude_items, gratitudeInput.trim()]
      });
      setGratitudeInput('');
    }
  };

  const handleRemoveGratitude = (index) => {
    setNewEntry({
      ...newEntry,
      gratitude_items: newEntry.gratitude_items.filter((_, i) => i !== index)
    });
  };

  // Save: require login and redirect if not logged in
  const saveEntry = async () => {
    if (!newEntry.content.trim()) {
      toast.error('Please write something');
      return;
    }
    if (!ensureLoggedIn(true)) return; // redirect to login if not logged in

    setIsSaving(true);
    try {
      const form = new FormData();
      form.append('title', newEntry.title);
      form.append('content', newEntry.content);
      form.append('mood', newEntry.mood);
      form.append('entry_date', newEntry.entry_date);
      form.append('is_private', 'true');
      form.append('gratitude_items', JSON.stringify(newEntry.gratitude_items));
      if (audioFile) form.append('audio', audioFile);

      const headers = getAuthHeader(); // IMPORTANT: do not include Content-Type
      const url = `${API_BASE}/api/diary${editingEntry ? `/${editingEntry._id}` : ''}`;
      const method = editingEntry ? 'PUT' : 'POST';

      console.log('saveEntry -> url:', url, 'method:', method, 'hasAudio:', !!audioFile);

      const res = await fetch(url, {
        method,
        headers,
        body: form
      });

      const text = await res.text().catch(() => '');
      console.log('saveEntry response:', res.status, text);

      if (!res.ok) {
        let body = text;
        try { body = JSON.parse(text); } catch (e) {}
        throw new Error(body?.message || `Server returned ${res.status}`);
      }

      toast.success('Saved diary entry!');
      setShowNewEntry(false);
      setAudioFile(null);
      await loadEntries();
      await refresh?.();
    } catch (err) {
      console.error('saveEntry error', err);
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete: require login and redirect if not logged in
  const deleteEntry = async (entryId) => {
    if (!window.confirm('Delete this entry?')) return;
    if (!ensureLoggedIn(true)) return;

    try {
      const headers = getAuthHeader();
      const url = `${API_BASE}/api/diary/${entryId}`;
      const res = await fetch(url, { method: 'DELETE', headers });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('deleteEntry failed', res.status, text);
        throw new Error('Delete failed');
      }
      toast.success('Deleted');
      await loadEntries();
    } catch (err) {
      console.error('deleteEntry error', err);
      toast.error('Delete failed');
    }
  };

  const getMoodEmoji = (mood) => {
    const map = {
      happy: '😊',
      calm: '😌',
      anxious: '😰',
      sad: '😢',
      stressed: '😫',
      grateful: '🙏',
      hopeful: '🌟'
    };
    return map[mood] || '😌';
  };

  // If user has not premium subscription, show upgrade CTA (unchanged)
  if (progress?.subscription_status !== 'premium') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <Card className="p-10 rounded-2xl text-center">
          <h2 className="text-2xl font-bold">Premium Feature</h2>
          <p className="mt-3 text-gray-600">Upgrade to premium to use the diary.</p>
          <Button onClick={() => window.location.href = '/Dashboard'} className="mt-6">Upgrade</Button>
        </Card>
      </div>
    );
  }

  const tokenPresent = !!accessToken;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gradient-to-br from-purple-50 via-white to-beige-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Private & Secure</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Diary</h1>
          <p className="text-gray-600 text-lg">Your thoughts, your space</p>

          {/* If user isn't signed in, show friendly sign-in button instead of redirecting */}
          {!tokenPresent && (
            <div className="mt-4">
              <Button onClick={() => window.location.href = '/login'} className="bg-purple-600 text-white">
                Sign in to use Diary
              </Button>
            </div>
          )}
        </div>

        {/* DEV screenshot preview - remove in production */}
        <div className="mb-6">
          <img src={DEV_IMAGE_URL} alt="dev-screenshot" style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }} />
        </div>

        <Button onClick={() => openNewEntryDialog(null)} className="w-full mb-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6 rounded-2xl">
          <Plus className="mr-2" /> New Entry (+5 coins)
        </Button>

        <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
          <DialogContent className="max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingEntry ? 'Edit Entry' : 'New Diary Entry'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <Input placeholder="Title (optional)" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} className="rounded-2xl border-2 py-4" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                  <Input type="date" value={newEntry.entry_date} onChange={(e) => setNewEntry({ ...newEntry, entry_date: e.target.value })} className="rounded-2xl border-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mood</label>
                  <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}>
                    <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">😊 Happy</SelectItem>
                      <SelectItem value="calm">😌 Calm</SelectItem>
                      <SelectItem value="anxious">😰 Anxious</SelectItem>
                      <SelectItem value="sad">😢 Sad</SelectItem>
                      <SelectItem value="stressed">😫 Stressed</SelectItem>
                      <SelectItem value="grateful">🙏 Grateful</SelectItem>
                      <SelectItem value="hopeful">🌟 Hopeful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Your Thoughts</label>
                <Textarea placeholder="Write about your day..." value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} className="rounded-2xl border-2 min-h-48" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Things I'm Grateful For</label>
                <div className="flex gap-2">
                  <Input placeholder="Add gratitude item" value={gratitudeInput} onChange={(e) => setGratitudeInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddGratitude()} />
                  <Button onClick={handleAddGratitude}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {newEntry.gratitude_items.map((g, idx) => (
                    <Badge key={idx} onClick={() => handleRemoveGratitude(idx)} className="cursor-pointer">{g} ✕</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Attach Audio (optional)</label>
                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                {audioFile && <div className="mt-2 text-sm text-gray-600">Selected: {audioFile.name}</div>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewEntry(false)} className="flex-1 rounded-2xl py-6">Cancel</Button>
                <Button onClick={saveEntry} disabled={isSaving} className="flex-1 rounded-2xl py-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* entries */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
            <p className="text-gray-600 mt-4">Loading your diary...</p>
          </div>
        ) : entries.length === 0 ? (
          <Card className="rounded-3xl p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries yet</h3>
            <p className="text-gray-600">Start journaling to track your mental wellness journey</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry._id} className="rounded-3xl border-2 border-gray-100 hover:shadow-lg transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        {new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    {entry.title && <h3 className="text-2xl font-bold text-gray-900">{entry.title}</h3>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="px-4 py-2">{getMoodEmoji(entry.mood)} {entry.mood}</Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => openNewEntryDialog(entry)}>Edit</Button>
                      <Button variant="ghost" onClick={() => deleteEntry(entry._id)}>Delete</Button>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{entry.content}</p>

                {entry.gratitude_items && entry.gratitude_items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Smile className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-600">Grateful for:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.gratitude_items.map((g, idx) => <Badge key={idx}>{g}</Badge>)}
                    </div>
                  </div>
                )}

                {entry.audioUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <audio controls src={entry.audioUrl} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
