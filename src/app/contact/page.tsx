import Link from 'next/link';
import { ArrowLeft, Phone, Mail } from 'lucide-react';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-serif text-stone-800 mb-2">Contact Us</h1>
        <p className="text-stone-500 mb-8">We'd love to hear from you. Get in touch with us through any of the channels below.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="https://wa.me/918078200591" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-6 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-colors">
            <div className="bg-stone-100 p-3 rounded-full text-stone-700">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">WhatsApp / Call</h3>
              <p className="text-stone-500 mt-1">+91 8078200591</p>
            </div>
          </a>
          
          <a href="mailto:marriageinvitationonline@gmail.com" className="flex items-start gap-4 p-6 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-colors">
            <div className="bg-stone-100 p-3 rounded-full text-stone-700">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">Email Us</h3>
              <p className="text-stone-500 mt-1 break-all">marriageinvitationonline@gmail.com</p>
            </div>
          </a>
          
          <a href="https://www.instagram.com/marriageinvitation.online?igsh=MXI1bmZwMjFoZzE3dw==" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-6 rounded-xl border border-stone-200 hover:border-pink-200 hover:bg-pink-50 transition-colors">
            <div className="bg-pink-100 p-3 rounded-full text-pink-600">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">Instagram</h3>
              <p className="text-stone-500 mt-1">@marriageinvitation.online</p>
            </div>
          </a>
          
          <a href="https://www.facebook.com/share/1GRwLmq8uZ/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-6 rounded-xl border border-stone-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FacebookIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">Facebook</h3>
              <p className="text-stone-500 mt-1">Connect with us</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
