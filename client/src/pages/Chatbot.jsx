// src/pages/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Send, Loader2, Volume2, VolumeX, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I'm your MannMitra companion. I'm here to listen and support you. How are you feeling today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  // Init Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      try {
        // eslint-disable-next-line no-undef
        recognitionRef.current = new webkitSpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => { setIsListening(false); toast.error('Voice recognition error'); };
        recognitionRef.current.onend = () => setIsListening(false);
      } catch (err) {
        console.warn("SpeechRecognition init failed", err);
      }
    }
    synthesisRef.current = typeof window !== 'undefined' ? window.speechSynthesis : null;
    return () => { recognitionRef.current?.stop?.(); synthesisRef.current?.cancel?.(); };
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || !synthesisRef.current) return;
    synthesisRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1; u.volume = 1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    synthesisRef.current.speak(u);
  };

  // --- FIXED URL FUNCTION ---
  const getChatUrl = () => {
    // If you have a .env file, this ensures we append /api/chat correctly
    if (import.meta.env?.VITE_API_BASE) {
      // Remove trailing slash if present to avoid double slashes
      const base = import.meta.env.VITE_API_BASE.replace(/\/$/, "");
      return `${base}/api/chat`;
    }
    
    // Default fallback for local development
    return 'http://localhost:3000/api/chat';
  };

  const sendToBackend = async (currentMessages) => {
    setIsLoading(true);
    try {
      const url = getChatUrl();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const txt = await res.text().catch(()=> '');
        console.error('Backend Error:', res.status, txt);
        return { ok: false };
      }
      
      const data = await res.json();
      return { ok: true, reply: data.reply };

    } catch (err) {
      console.error('Network Error:', err);
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');

    // 1. Update UI with user message immediately
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);

    // 2. Prepare history for backend
    const conversationHistory = [...messages, userMessage];

    // 3. Call Backend
    const result = await sendToBackend(conversationHistory);

    if (result.ok && result.reply) {
      // SUCCESS: Add Backend Reply
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
      if (voiceEnabled) speak(result.reply);
    } else {
      // FAILURE: Add Fallback Reply
      const fallback = "I'm having trouble connecting to my brain right now. Please check your internet or try again later.";
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      if (voiceEnabled) speak(fallback);
      toast.error("Could not reach the AI server.");
    }
  };

  const toggleVoice = () => {
    const val = !voiceEnabled;
    if (isSpeaking && !val) synthesisRef.current?.cancel?.();
    setVoiceEnabled(val);
  };

  const startListening = () => {
    if (!recognitionRef.current) { toast.error('Voice recognition not supported'); return; }
    try { setIsListening(true); recognitionRef.current.start(); } catch (e) { setIsListening(false); }
  };
  const stopListening = () => { recognitionRef.current?.stop?.(); setIsListening(false); };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Heart className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Your Safe Space</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MannMitra Chatbot</h1>
          <p className="text-gray-600">I'm here to listen and support you, anytime</p>
        </div>

        <Card className="rounded-3xl shadow-xl border-2 border-purple-100 overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-white">
            {messages.map((m,i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${m.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-6 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600"/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-beige-50">
            <div className="flex gap-2 items-end">
              <Button size="icon" variant={voiceEnabled ? 'default' : 'outline'} onClick={toggleVoice} className={`rounded-xl ${voiceEnabled ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                {voiceEnabled ? <Volume2 className={`h-5 w-5 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-5 w-5"/>}
              </Button>

              <div className="flex-1">
                <Input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Type your message or use voice..."
                  className="rounded-2xl border-2 border-purple-100 focus:border-purple-400 px-6 py-6 text-base"
                  disabled={isLoading}
                />
              </div>

              <Button size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={isListening ? stopListening : startListening} className={`rounded-xl ${isListening ? 'animate-pulse' : ''}`} disabled={isLoading}>
                {isListening ? <MicOff className="h-5 w-5"/> : <Mic className="h-5 w-5"/>}
              </Button>

              <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading} className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5"/>}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Click the mic to use voice input • Click speaker to toggle voice responses</p>
          </div>
        </Card>
      </div>
    </div>
  );
}