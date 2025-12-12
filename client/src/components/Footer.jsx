// src/components/Footer.jsx
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white border-t border-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-white drop-shadow-md">
                MannMitra
              </span>
            </h3>
            <p className="text-purple-200 leading-relaxed text-sm">
              To protect the little hearts and help India reach its destiny. Your companion for mental wellness and holistic growth.
            </p>
            
            {/* SOCIAL LINKS UPDATED HERE */}
            <div className="flex space-x-4">
              <SocialIcon 
                Icon={Facebook} 
                href="#" 
              />
              <SocialIcon 
                Icon={Twitter} 
                href="https://x.com/algo_rhythm_onX" 
              />
              <SocialIcon 
                Icon={Instagram} 
                href="https://www.instagram.com/__algo.rhythm__?igsh=bHg3dDRrcm1xMGlz" 
              />
              <SocialIcon 
                Icon={Linkedin} 
                href="https://www.linkedin.com/company/algo-rhythm006/" 
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/community" text="Community" />
              <FooterLink to="/chatbot" text="AI Chatbot" />
              <FooterLink to="/dashboard" text="Dashboard" />
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/audio" text="Relaxation Audio" />
              <FooterLink to="/diary" text="Personal Diary" />
              <FooterLink to="/classes" text="Yoga Classes" />
              <FooterLink to="/assessment" text="Self Assessment" />
              <FooterLink to="/rewards" text="Rewards Store" />
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-purple-800/50 rounded-lg group-hover:bg-purple-700 transition-colors">
                  <Mail className="h-4 w-4 text-purple-200" />
                </div>
                <span className="text-purple-200 group-hover:text-white transition-colors">algorhythm006@gmail.com</span>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-purple-800/50 rounded-lg group-hover:bg-purple-700 transition-colors">
                  <Phone className="h-4 w-4 text-purple-200" />
                </div>
                <span className="text-purple-200 group-hover:text-white transition-colors">+91 8927754281</span>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-purple-800/50 rounded-lg group-hover:bg-purple-700 transition-colors mt-1">
                  <MapPin className="h-4 w-4 text-purple-200" />
                </div>
                <span className="text-purple-200 group-hover:text-white transition-colors">Garia, Kolkata,<br/>West Bengal, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-purple-300 text-sm flex items-center gap-1">
            © 2025 Algo Rhythm. Made with <Heart className="h-3 w-3 text-pink-400 fill-pink-400" /> in India.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-purple-300 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-purple-300 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="text-purple-200 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
      {text}
    </Link>
  </li>
);

// Updated SocialIcon to accept 'href'
const SocialIcon = ({ Icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-800/50 hover:bg-white group transition-all duration-300"
  >
    <Icon className="h-4 w-4 text-purple-200 group-hover:text-purple-900 transition-colors" />
  </a>
);

export default Footer;