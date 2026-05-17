import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-serif text-stone-800 mb-6">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none text-stone-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when using our platform to create or view wedding invitations, including names, event details, and uploaded media.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, and to display your created invitations publicly or privately based on your settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the personal data we process against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at marriageinvitationonline@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
