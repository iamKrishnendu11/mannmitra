import React from 'react';
import { AlertTriangle, Book, Scale, HeartHandshake } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-900 px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-indigo-200 max-w-2xl mx-auto">
              Please read these terms carefully before using MannMitra.
            </p>
          </div>
        </div>

        {/* Vital Medical Disclaimer Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 m-8 rounded-r-xl">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-amber-800 mb-1">IMPORTANT: Medical Disclaimer</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                MannMitra is a self-help and wellness tool. <strong>We are NOT a medical service provider.</strong> The content, AI chatbot, and assessments are for informational purposes only and do not constitute professional medical advice, diagnosis, or treatment. If you are experiencing a crisis or suicidal thoughts, please contact a professional or emergency services immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-12 space-y-10 text-gray-700 leading-relaxed">
          
          <Section title="1. Acceptance of Terms" icon={<Book className="h-6 w-6 text-indigo-600" />}>
            <p>
              By creating an account or using MannMitra, provided by <strong>Algo Rhythm</strong> ("we," "us"), you agree to be bound by these Terms. If you do not agree to these terms, please do not use our services.
            </p>
          </Section>

          <Section title="2. User Accounts">
            <p>
              You are responsible for safeguarding the password that you use to access the service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </Section>

          <Section title="3. Community Guidelines" icon={<HeartHandshake className="h-6 w-6 text-indigo-600" />}>
            <p>Our community is a safe space. You agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Post content that is hate speech, threatening, or harassing.</li>
              <li>Share explicit or illegal content.</li>
              <li>Spam or solicit other users.</li>
            </ul>
            <p className="mt-3">We reserve the right to terminate accounts that violate these guidelines without notice.</p>
          </Section>

          <Section title="4. Premium Subscriptions">
            <p>
              Certain features (e.g., unlimited diary, advanced yoga classes) require a paid subscription.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Billing:</strong> You authorize us to charge your payment method for the subscription fee.</li>
              <li><strong>Refunds:</strong> Refunds are handled on a case-by-case basis or according to local laws.</li>
              <li><strong>Cancellation:</strong> You may cancel your Premium subscription at any time; access continues until the end of the billing period.</li>
            </ul>
          </Section>

          <Section title="5. Limitation of Liability" icon={<Scale className="h-6 w-6 text-indigo-600" />}>
            <p>
              To the maximum extent permitted by law, Algo Rhythm shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the service.
            </p>
          </Section>

          <Section title="6. Governing Law">
            <p>
              These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions. Any disputes shall be subject to the jurisdiction of the courts in Kolkata, West Bengal.
            </p>
          </Section>

          <Section title="7. Contact Us">
            <p>For any legal concerns regarding these terms, please reach out to:</p>
            <p className="mt-2 font-medium">Algo Rhythm Legal Team</p>
            <p>Email: legal@mannmitra.com</p>
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
      {icon && <div className="p-2 bg-indigo-100 rounded-lg">{icon}</div>}
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="text-gray-600">
      {children}
    </div>
  </section>
);