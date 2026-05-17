import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-serif text-stone-800 mb-6">Terms & Conditions</h1>
        <div className="prose prose-stone max-w-none text-stone-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using our wedding invitation platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">2. User Content</h2>
            <p>You retain all your ownership rights in your User Content. By submitting User Content to our platform, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content in connection with the service provided.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">3. Acceptable Use</h2>
            <p>You agree not to use the service to upload, post, transmit, or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif text-stone-800 mb-3">4. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. We will always post the most current version on our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
