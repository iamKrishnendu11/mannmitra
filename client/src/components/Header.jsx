import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils/index.js';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'sonner';

export default function Header() {
  // Destructure logout (ensure your AuthContext exports this now)
  const { user, progress, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      // 1. Call the logout function from context
      if (logout) {
        await logout();
      }

      // 2. Clear menu states
      setShowDropdown(false);
      setMobileMenuOpen(false);
      
      toast.success("Logged out successfully");
      
      // 3. CORRECT FIX: Use navigate instead of window.location.href
      // This changes the URL without reloading the app, preventing auto-login
      navigate('/'); 
      
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-lavender-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              MannMitra
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to={createPageUrl('Chatbot')} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Chatbot
            </Link>
            <Link to={createPageUrl('Assessment')} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Assessment
            </Link>
            <Link to={createPageUrl('Community')} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Community
            </Link>

            {user && progress?.subscription_status === 'premium' && (
              <>
                <Link to={createPageUrl('Classes')} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Classes
                </Link>
                <Link to={createPageUrl('Audio')} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Audio
                </Link>
                <Link to={createPageUrl('Diary')} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Diary
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4" ref={dropdownRef}>
                {/* Coins Badge */}
                <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700 font-semibold">{progress?.coins || 0} Coins</span>
                </Link>

                {/* Avatar Dropdown Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link 
                        to={createPageUrl('Dashboard')} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Profile
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to={createPageUrl('Login')} className="px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">Login</Link>
                <Link to={createPageUrl('Register')} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">Sign up</Link>
              </div>
            )}
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE MENU CONTENT */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-lavender-100 bg-white">
            <nav className="flex flex-col gap-2">
              <Link to={createPageUrl('Chatbot')} className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg mx-2">Chatbot</Link>
              <Link to={createPageUrl('Assessment')} className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg mx-2">Assessment</Link>
              <Link to={createPageUrl('Community')} className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg mx-2">Community</Link>

              {user && progress?.subscription_status === 'premium' && (
                <>
                  <Link to={createPageUrl('Classes')} className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg mx-2">Classes</Link>
                  <Link to={createPageUrl('Audio')} className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg mx-2">Audio</Link>
                  <Link to={createPageUrl('Diary')} className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg mx-2">Diary</Link>
                </>
              )}

              {user ? (
                <div className="border-t border-gray-100 mt-2 pt-2">
                   <div className="px-6 py-2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                   </div>
                  <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 px-6 py-3 text-purple-700 font-medium hover:bg-purple-50 mx-2 rounded-lg">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard ({progress?.coins || 0} Coins)
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 mx-2 rounded-lg text-left">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2 px-2">
                  <Link to={createPageUrl('Login')} className="px-4 py-3 text-center text-gray-700 hover:bg-purple-50 rounded-lg border border-gray-200">Login</Link>
                  <Link to={createPageUrl('Register')} className="px-4 py-3 text-center bg-purple-600 text-white rounded-lg shadow-md">Sign up</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}