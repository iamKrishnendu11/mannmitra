// src/pages/About.jsx
import React from 'react';
import { 
  Heart, 
  Users, 
  Shield, 
  Target, 
  MapPin, 
  Mail, 
  Sparkles,
  Brain,
  Coffee
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-beige-50">
      
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-full border border-purple-500/30 mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-200">Welcome to MannMitra</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
            Healing Hearts, <br />
            Empowering Minds
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            "To protect the little hearts and help India reach its destiny."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 -mt-20 relative z-20">
        
        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md hover:-translate-y-2 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create a safe, accessible, and judgment-free digital ecosystem where every individual can prioritize their mental well-being without hesitation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white transform md:-translate-y-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Core Value</h3>
              <p className="text-purple-100">
                Empathy drives everything we do. We believe that emotional support should be as readily available as physical healthcare, delivered with compassion and care.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md hover:-translate-y-2 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Promise</h3>
              <p className="text-gray-600">
                Your privacy is paramount. We provide a secure environment where you can explore self-assessment, therapy, and community support with complete peace of mind.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Who We Are Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                We are <span className="font-bold text-purple-700">Algo Rhythm</span>, a passionate team of developers and innovators based in Kolkata.
              </p>
              <p>
                MannMitra was born out of a realization: in the hustle of modern India, mental peace is often left behind. We combined technology with psychology to build a platform that serves as a friend ("Mitra") to your mind ("Mann").
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      Dev
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500">Built with love by Algo Rhythm</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="bg-purple-100 p-6 rounded-3xl h-48 flex flex-col justify-end">
                <Brain className="h-10 w-10 text-purple-600 mb-2" />
                <span className="font-bold text-purple-900">Smart AI Support</span>
              </div>
              <div className="bg-indigo-100 p-6 rounded-3xl h-40 flex flex-col justify-end">
                <Users className="h-10 w-10 text-indigo-600 mb-2" />
                <span className="font-bold text-indigo-900">Community</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-pink-100 p-6 rounded-3xl h-40 flex flex-col justify-end">
                <Heart className="h-10 w-10 text-pink-600 mb-2" />
                <span className="font-bold text-pink-900">Wellness</span>
              </div>
              <div className="bg-orange-100 p-6 rounded-3xl h-48 flex flex-col justify-end">
                <Coffee className="h-10 w-10 text-orange-600 mb-2" />
                <span className="font-bold text-orange-900">Daily Journal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Come say hi! 👋</h2>
              <p className="text-purple-200 mb-6 max-w-md">
                We are building the future of wellness from the City of Joy.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span>Garia, Kolkata, West Bengal, India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <span>algorhythm006@gmail.com</span>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder or Visual */}
            <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
               <p className="text-sm font-medium text-purple-200 uppercase tracking-widest mb-2">Team</p>
               <h3 className="text-2xl font-bold text-white">Algo Rhythm</h3>
               <div className="flex justify-center gap-4 mt-6">
                 {/* Social Links from Footer */}
                 <a href="https://x.com/algo_rhythm_onX" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-purple-600 transition-colors">
                   <span className="sr-only">Twitter</span>
                   <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                 </a>
                 <a href="https://www.linkedin.com/company/algo-rhythm006/" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-purple-600 transition-colors">
                   <span className="sr-only">LinkedIn</span>
                   <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                 </a>
               </div>
            </div>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}