// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Assessment from './pages/Assessment';
import Community from './pages/Community';
import Classes from './pages/Classes';
import Audio from './pages/Audio';
import Diary from './pages/Diary';
import Rewards from './pages/Rewards';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import { AuthProvider } from './contexts/AuthContext';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

/**
 * Layout: ONLY handles Header and Footer.
 * AuthProvider is now moved up to wrapping the RouterProvider.
 */
const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  // Main App Routes (With Header & Footer)
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'chatbot', element: <Chatbot /> },
      { path: 'assessment', element: <Assessment /> },
      { path: 'community', element: <Community /> },
      { path: 'classes', element: <Classes /> },
      { path: 'audio', element: <Audio /> },
      { path: 'diary', element: <Diary /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'dashboard', element: <Dashboard /> },
      {path: 'about', element: <About /> },
      {path: 'terms-of-service', element: <TermsOfService /> },
      {path: 'privacy-policy', element: <PrivacyPolicy /> },
    ]
  },

  // Auth Routes (NO Header/Footer, but still get AuthProvider from below)
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> }
]);

const App = () => {
  // Wrap the entire RouterProvider with AuthProvider
  // This ensures Login and Register also have access to useAuth()
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;