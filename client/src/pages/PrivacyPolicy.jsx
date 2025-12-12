import React from 'react';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 rounded-full border border-purple-500/30 mb-6 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Last Updated: December 2025</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-purple-200 max-w-2xl mx-auto">
              Your trust is our top priority. We are committed to protecting the privacy and security of your personal and emotional data.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">
          
          <Section title="1. Introduction" icon={<FileText className="h-6 w-6 text-purple-600" />}>
            <p>
              Welcome to <strong>MannMitra</strong> ("we," "our," or "us"), a mental wellness platform developed by <strong>Algo Rhythm</strong>. By accessing or using our website, mobile application, and services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </Section>

          <Section title="2. Information We Collect" icon={<Eye className="h-6 w-6 text-purple-600" />}>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Personal Information:</strong> Name, email address, and profile details provided during registration.</li>
              <li><strong>Wellness Data:</strong> Mood logs, diary entries, assessment responses, and chatbot interactions.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, such as classes completed and rewards redeemed.</li>
            </ul>
            <div className="bg-purple-50 p-4 rounded-xl mt-4 border border-purple-100">
              <p className="text-sm text-purple-800 font-medium">
                <strong>Note on Sensitive Data:</strong> Your diary entries and private chat logs are encrypted. We do not sell your emotional data to advertisers.
              </p>
            </div>
          </Section>

          <Section title="3. How We Use Your Information" icon={<Lock className="h-6 w-6 text-purple-600" />}>
            <p>We use the collected data to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Provide personalized wellness recommendations (e.g., suggesting yoga classes based on mood).</li>
              <li>Monitor and improve the performance of our AI chatbot.</li>
              <li>Process transactions for Premium subscriptions and rewards.</li>
              <li>Send important updates regarding your account or safety.</li>
            </ul>
          </Section>

          <Section title="4. Data Security" icon={<Shield className="h-6 w-6 text-purple-600" />}>
            <p>
              We implement industry-standard security measures, including encryption and secure server protocols, to protect your data. However, no method of transmission over the internet is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
            </p>
          </Section>

          <Section title="5. Sharing of Information">
            <p>We do not sell or rent your personal information. We may share data only in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Legal Compliance:</strong> If required by law enforcement to protect the safety of you or others.</li>
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our platform (e.g., payment processors, cloud hosting), bound by strict confidentiality agreements.</li>
            </ul>
          </Section>

          <Section title="6. Contact Us" icon={<Mail className="h-6 w-6 text-purple-600" />}>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p><strong>Email:</strong> info@mannmitra.com</p>
              <p><strong>Address:</strong> Algo Rhythm, Garia, Kolkata, West Bengal, India</p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

// Helper Component
const Section = ({ title, icon, children }) => (
  <section className="border-b border-gray-100 pb-8 last:border-0">
    <div className="flex items-center gap-3 mb-4">
      {icon && <div className="p-2 bg-purple-100 rounded-lg">{icon}</div>}
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="text-gray-600">
      {children}
    </div>
  </section>
);