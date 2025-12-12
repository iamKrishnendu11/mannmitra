// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Heart, MessageCircle, FileText, Users, Music, BookOpen, 
  Video, Gift, Sparkles, Check, ArrowRight, Star
} from 'lucide-react';

import UpgradeButtonInstant from '@/components/UpgradeButtonInstant';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, progress } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-white to-beige-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Your Mental Wellness Companion</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mt-2">
                MannMitra
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Your journey to mental wellness starts here. Get personalized support, connect with a caring community, and discover tools that help you thrive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Chatbot')}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300"
                >
                  Try Chatbot
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and support to help you on your journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'AI Chatbot with Voice',
                description: 'Talk or type with our compassionate AI assistant anytime you need support',
                color: 'purple'
              },
              {
                icon: FileText,
                title: 'Mental Health Reports',
                description: 'Get personalized wellness assessments and track your progress over time',
                color: 'blue'
              },
              {
                icon: Users,
                title: 'Supportive Community',
                description: 'Share your story and connect with others on similar journeys',
                color: 'pink'
              },
              {
                icon: BookOpen,
                title: 'Private Diary',
                description: 'Express your thoughts safely in your personal digital journal',
                color: 'green',
                premium: true
              },
              {
                icon: Video,
                title: 'Yoga & Meditation',
                description: 'Access guided classes for relaxation and mindfulness',
                color: 'orange',
                premium: true
              },
              {
                icon: Music,
                title: 'Relaxation Audio',
                description: 'Soothing sounds and meditations to calm your mind',
                color: 'indigo',
                premium: true
              }
            ].map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 rounded-3xl group">
                <div className={`h-14 w-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                </div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  {feature.premium && (
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-full font-medium">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Wellness Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade anytime for premium features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 rounded-3xl border-2 border-gray-200 hover:shadow-lg transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Trial</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-600">/forever</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  'AI Chatbot with voice',
                  'Mental health assessments',
                  'Community access',
                  'Progress tracking'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-lg rounded-2xl border-2 hover:bg-gray-50"
                >
                  Start Free
                </Button>
              </Link>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 rounded-3xl border-4 border-purple-300 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden hover:shadow-2xl transition-all">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">₹449</span>
                  <span className="text-gray-600">/30 days</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Everything in Free',
                  'Personal therapist access',
                  'Private digital diary',
                  'Relaxation audio library',
                  'Yoga & meditation classes',
                  'Earn coins for activities',
                  'Redeem rewards (merch)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              {/* ---------- CONDITIONAL BUTTON ---------- */}
              {user && progress?.subscription_status === 'premium' ? (
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all">
                    🎉 Welcome to Premium
                  </Button>
                </Link>
              ) : (
                <div className="w-full">
                  <UpgradeButtonInstant className="w-full py-6 text-lg rounded-2xl" />
                </div>
              )}
              {/* ------------------------------------------ */}

            </Card>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-12 text-center text-white">
            <Gift className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Earn Rewards for Your Progress</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Premium members earn coins for daily logins, completing classes, and maintaining their diary. 
              Redeem coins for exclusive MannMitra merchandise!
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="h-5 w-5" />
                <span>T-Shirts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="h-5 w-5" />
                <span>Journals</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="h-5 w-5" />
                <span>Pens</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="h-5 w-5" />
                <span>Bags</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-beige-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands taking control of their mental health with MannMitra
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin Your Journey
              <Heart className="ml-2 h-5 w-5" fill="white" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
