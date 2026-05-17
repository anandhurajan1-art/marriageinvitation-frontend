import Link from 'next/link';
import { Heart, Phone, Mail } from 'lucide-react';

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

async function getPublicInvitations() {
  try {
    const res = await fetch('http://localhost:5000/api/invitations/public', {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const invitations = await getPublicInvitations();

  return (
    <div className="min-h-screen bg-stone-50 font-serif flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            Marriage Invitation Online
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-stone-800 mb-6">
          Celebrate Love
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto font-sans mb-10">
          Discover beautiful digital wedding invitations created with elegance and care.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {invitations.length === 0 ? (
          <div className="text-center text-stone-500 py-12">
            No public invitations available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {invitations.map((inv: any) => (
              <Link 
                href={`/invitation/${inv.id}`} 
                key={inv.id}
                className="group block bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                  {inv.bg_image ? (
                    <img 
                      src={`http://localhost:5000${inv.bg_image}`} 
                      alt="Cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                      <Heart className="w-12 h-12 text-stone-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">{inv.groom_name} & {inv.bride_name}</h3>
                    <p className="text-sm font-sans opacity-90">{new Date(inv.wedding_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 font-sans">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Marriage Invitation Online
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                Create beautiful, timeless, and elegant digital marriage invitations to share with your loved ones.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-stone-800 mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm text-stone-500">
                <li><Link href="/" className="hover:text-rose-500 transition-colors">Home</Link></li>
                <li><Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-rose-500 transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/contact" className="hover:text-rose-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-stone-800 mb-4 uppercase text-xs tracking-wider">Contact Us</h4>
              <ul className="space-y-3 text-sm text-stone-500">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <a href="https://wa.me/918078200591" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors">
                    +91 8078200591
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <a href="mailto:marriageinvitationonline@gmail.com" className="hover:text-rose-500 transition-colors">
                    marriageinvitationonline@gmail.com
                  </a>
                </li>
              </ul>
              
              <div className="flex gap-4 mt-6">
                <a href="https://www.instagram.com/marriageinvitation.online?igsh=MXI1bmZwMjFoZzE3dw==" target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-100 rounded-full text-stone-600 hover:text-white hover:bg-pink-600 transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/share/1GRwLmq8uZ/" target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-100 rounded-full text-stone-600 hover:text-white hover:bg-blue-600 transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-stone-100 text-center text-sm font-sans text-stone-400">
            &copy; {new Date().getFullYear()} Marriage Invitation Online. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
