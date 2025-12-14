// src/utils/index.js
const pageRoutes = {
  Home: '/',
  Dashboard: '/dashboard',
  Chatbot: '/chatbot',
  Diary: '/diary',
  Reports: '/reports',
  Community: '/community',
  Assessment: '/assessment',
  Community: '/community',
  Classes: '/classes',
  Audio: '/audio',
  Diary:'/diary',
  Rewards: '/rewards',
  Login: '/login',
  Register: '/register',
  About: '/about',
  TermsOfService: '/terms-of-service',
  PrivacyPolicy: '/privacy-policy'
};

// This function converts a page key to a usable URL
export function createPageUrl(pageName) {
  return pageRoutes[pageName] || '/';
}
