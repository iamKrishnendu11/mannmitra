import Assessment from "@/pages/Assessment";    
import Community from "@/pages/Community";
import Diary from "@/pages/Diary";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Rewards from "@/pages/Rewards";
import TermsOfService from "@/pages/TermsOfService";

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
