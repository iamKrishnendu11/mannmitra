// src/pages/Community.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageCircle, Upload, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Community() {
  const { user, accessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // create/edit dialog
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'story',
    media_type: 'none',
    media_url: null
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // previous stories modal
  const [showPreviousModal, setShowPreviousModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const authHeaders = () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {});

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/community?limit=100`, {
        headers: { ...authHeaders() }
      });
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const previewUrl = URL.createObjectURL(file);
    setNewPost((prev) => ({
      ...prev,
      media_url: previewUrl,
      media_type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
  };

  const handleSavePost = async () => {
    if (!accessToken) {
      toast.error('Please sign in to post');
      return;
    }
    if (!newPost.content || !newPost.content.trim()) {
      toast.error('Please write something');
      return;
    }

    setIsSaving(true);
    try {
      const form = new FormData();
      form.append('title', newPost.title || '');
      form.append('content', newPost.content);
      form.append('post_type', newPost.post_type || 'story');
      if (mediaFile) form.append('media', mediaFile);

      let res;
      if (editingPost) {
        // update
        res = await fetch(`${API_BASE}/api/community/${editingPost._id}`, {
          method: 'PUT',
          headers: { ...authHeaders() },
          body: form
        });
      } else {
        // create
        res = await fetch(`${API_BASE}/api/community`, {
          method: 'POST',
          headers: { ...authHeaders() },
          body: form
        });
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('save post failed', res.status, text);
        throw new Error('Save failed');
      }

      await res.json();
      toast.success(editingPost ? 'Post updated' : 'Post shared with the community!');
      setShowCreatePost(false);
      setEditingPost(null);
      setNewPost({
        title: '',
        content: '',
        post_type: 'story',
        media_type: 'none',
        media_url: null
      });
      setMediaFile(null);
      await loadPosts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async (post) => {
    if (!accessToken) {
      toast.error('Please sign in to like');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/community/${post._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() }
      });
      if (!res.ok) throw new Error('Like failed');
      const json = await res.json();
      setPosts((p) =>
        p.map((x) => (x._id === post._id ? { ...x, likes: json.likes } : x))
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to like');
    }
  };

  const handleComment = async (postId, text) => {
    if (!accessToken) {
      toast.error('Please sign in to comment');
      return;
    }
    if (!text || !text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/community/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Comment failed');
      const comment = await res.json();
      setPosts((p) =>
        p.map((x) =>
          x._id === postId
            ? { ...x, comments: [...(x.comments || []), comment] }
            : x
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to comment');
    }
  };

  // SIMPLE delete: confirm once, call backend, update UI
  const handleDelete = async (post) => {
    if (!accessToken) {
      toast.error('Please sign in to delete');
      return;
    }

    const ok = window.confirm('Delete this post?');
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/community/${post._id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('delete failed', res.status, text);
        toast.error('Failed to delete post');
        return;
      }

      toast.success('Post deleted');
      // update UI immediately
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const getPostTypeColor = (type) => {
    const colors = {
      story: 'bg-purple-100 text-purple-700',
      achievement: 'bg-green-100 text-green-700',
      support: 'bg-blue-100 text-blue-700',
      inspiration: 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const openEditDialog = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title || '',
      content: post.content || '',
      post_type: post.post_type || 'story',
      media_type: post.media_type || (post.media_url ? 'image' : 'none'),
      media_url: post.media_url || null
    });
    setMediaFile(null);
    setShowCreatePost(true);
  };

  function resolveId(val) {
    if (!val) return null;
    if (typeof val === 'object') {
      const maybe =
        val._id ??
        val.id ??
        val.author?._id ??
        val._doc?._id ??
        val._doc?.id;
      return maybe ? String(maybe).trim() : null;
    }
    return String(val).trim();
  }

  const currentUserId = resolveId(user?.id ?? user?._id ?? user);
  const myPosts = posts.filter((p) => {
    const authorId = resolveId(
      p?.author ?? p?.authorId ?? p?.user ?? p?.createdBy
    );
    return authorId && currentUserId && authorId === currentUserId;
  });
  // -------------------------------------------------------------------

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Community Support
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Share Your Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with others and inspire hope
          </p>
        </div>

        {/* SHARE + YOUR PREVIOUS STORY BUTTONS */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6 rounded-2xl shadow-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />{' '}
                  {editingPost ? 'Edit Post' : 'Share Your Story'}
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingPost ? 'Edit Post' : 'Create a Post'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="rounded-2xl border-2 py-6 text-lg"
                  />
                  <Textarea
                    placeholder="Share your story..."
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    className="rounded-2xl border-2 min-h-32"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={newPost.post_type}
                      onValueChange={(value) =>
                        setNewPost({ ...newPost, post_type: value })
                      }
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="story">My Story</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="support">Need Support</SelectItem>
                        <SelectItem value="inspiration">Inspiration</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative">
                      <input
                        id="community-media"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleMediaChange}
                      />
                      <label htmlFor="community-media">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-2xl"
                          disabled={uploadingMedia}
                        >
                          {uploadingMedia ? (
                            'Uploading...'
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" /> Add Media
                            </>
                          )}
                        </Button>
                      </label>
                    </div>
                  </div>

                  {newPost.media_url && (
                    <div className="relative rounded-2xl overflow-hidden">
                      {newPost.media_type === 'image' ? (
                        <img
                          src={newPost.media_url}
                          alt="Upload preview"
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <video
                          src={newPost.media_url}
                          controls
                          className="w-full h-48"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreatePost(false);
                        setMediaFile(null);
                        setNewPost({
                          title: '',
                          content: '',
                          post_type: 'story',
                          media_type: 'none',
                          media_url: null
                        });
                        setEditingPost(null);
                      }}
                      className="flex-1 rounded-2xl py-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSavePost}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl py-6 text-white"
                    >
                      {isSaving
                        ? 'Saving...'
                        : editingPost
                        ? 'Save Changes'
                        : 'Post'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* PREVIOUS STORIES BUTTON */}
            <Button
              onClick={() => setShowPreviousModal(true)}
              size="lg"
              variant="outline"
              className="w-full rounded-2xl py-6"
            >
              Your Previous Story
            </Button>
          </div>
        </div>

        {/* PREVIOUS STORIES MODAL */}
        <Dialog open={showPreviousModal} onOpenChange={setShowPreviousModal}>
          <DialogContent className="max-w-3xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Your Previous Stories
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4 max-h-[60vh] overflow-auto">
              {isLoading ? (
                <div className="text-center py-6">Loading...</div>
              ) : myPosts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600">
                    You haven't shared any posts yet.
                  </p>
                </div>
              ) : (
                myPosts.map((p) => (
                  <Card key={p._id} className="rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          {p.title || '(no title)'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(p.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            openEditDialog(p);
                            setShowPreviousModal(false);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                      {p.content}
                    </p>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowPreviousModal(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* MAIN POSTS LIST */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
              <p className="text-gray-600 mt-4">Loading community posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="rounded-3xl p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600">Be the first to share your story!</p>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post._id}
                className="rounded-3xl border-2 border-gray-100 hover:shadow-lg transition-all overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {(
                            post.authorName ||
                            post.author?.name ||
                            'U'
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.authorName ?? post.author?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={`${getPostTypeColor(
                        post.post_type
                      )} border-0`}
                    >
                      {post.post_type}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {post.media_url && post.media_type === 'image' && (
                    <img
                      src={post.media_url}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-2xl mb-4"
                    />
                  )}

                  {post.media_url && post.media_type === 'video' && (
                    <video
                      src={post.media_url}
                      controls
                      className="w-full h-64 rounded-2xl mb-4"
                    />
                  )}

                  <div className="flex items-center gap-4 pt-4 border-top border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post)}
                      className="flex items-center gap-2 hover:bg-purple-50 rounded-xl"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          post.likes > 0
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className="text-gray-700 font-medium">
                        {post.likes || 0}
                      </span>
                    </Button>

                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 font-medium">
                        {post.comments?.length || 0}
                      </span>
                    </div>

                    {/* Edit/Delete only for current user's posts */}
                    {currentUserId &&
                      currentUserId ===
                        resolveId(
                          post?.author ??
                            post?.authorId ??
                            post?.user ??
                            post?.createdBy
                        ) && (
                        <div className="ml-auto flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                  </div>

                  {/* comments + input */}
                  <div className="mt-4">
                    {post.comments &&
                      post.comments.slice(-3).map((c) => (
                        <div key={c._id} className="mb-2">
                          <div className="text-sm">
                            <strong>{c.userName ?? c.user?.name ?? 'User'}</strong>{' '}
                            <span className="text-gray-600 text-xs">
                              · {new Date(c.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-gray-700">{c.text}</div>
                        </div>
                      ))}

                    <CommentInput postId={post._id} onComment={handleComment} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* comment box under each post */
function CommentInput({ postId, onComment }) {
  const [text, setText] = useState('');
  return (
    <div className="flex gap-2 mt-2">
      <Input
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
      />
      <Button
        onClick={() => {
          onComment(postId, text);
          setText('');
        }}
      >
        Reply
      </Button>
    </div>
  );
}