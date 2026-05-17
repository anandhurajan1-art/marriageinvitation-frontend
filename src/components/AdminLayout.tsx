"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, LayoutDashboard, PlusCircle, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout, username } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [token, pathname, router]);

  if (!mounted) return null; // Prevent hydration mismatch

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-serif font-semibold text-stone-800">Wedding Admin</h2>
            <p className="text-sm text-stone-500 mt-1">Welcome, {username}</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            <Link 
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <Globe className="w-5 h-5" />
              Public Home Page
            </Link>
            <Link 
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === '/admin/dashboard' 
                  ? 'bg-stone-100 text-stone-900 font-medium' 
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              href="/admin/create"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === '/admin/create' 
                  ? 'bg-stone-100 text-stone-900 font-medium' 
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              Create Invitation
            </Link>
          </nav>

          <div className="p-4 border-t border-stone-200">
            <button
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
