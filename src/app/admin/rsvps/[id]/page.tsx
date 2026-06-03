"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Users, CheckCircle2, XCircle } from 'lucide-react';

interface Rsvp {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests_count: number;
  message: string | null;
  created_at: string;
}

export default function RsvpsPage() {
  const { id } = useParams();
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRsvps();
  }, [id]);

  const fetchRsvps = async () => {
    try {
      const res = await api.get(`/rsvps/${id}`);
      setRsvps(res.data);
    } catch (err: any) {
      console.error('Failed to fetch RSVPs:', err);
      setError('Failed to load RSVPs.');
    } finally {
      setLoading(false);
    }
  };

  const totalAttending = rsvps.filter(r => r.attending).reduce((sum, r) => sum + r.guests_count, 0);
  const totalDeclined = rsvps.filter(r => !r.attending).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/dashboard" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-800">Guest RSVPs</h1>
          <p className="text-stone-500">Manage responses for this invitation</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-stone-700" />
          </div>
          <div>
            <p className="text-stone-500 text-sm font-medium">Total Responses</p>
            <p className="text-2xl font-bold text-stone-800">{rsvps.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-stone-500 text-sm font-medium">Total Guests Attending</p>
            <p className="text-2xl font-bold text-stone-800">{totalAttending}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-stone-500 text-sm font-medium">Declined</p>
            <p className="text-2xl font-bold text-stone-800">{totalDeclined}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : rsvps.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500">No RSVPs have been submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-4 font-medium text-stone-600">Name</th>
                  <th className="p-4 font-medium text-stone-600">Email</th>
                  <th className="p-4 font-medium text-stone-600">Attending</th>
                  <th className="p-4 font-medium text-stone-600">Guests</th>
                  <th className="p-4 font-medium text-stone-600 max-w-xs">Message</th>
                  <th className="p-4 font-medium text-stone-600 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="p-4 font-medium text-stone-800">{rsvp.name}</td>
                    <td className="p-4 text-stone-500">{rsvp.email || '-'}</td>
                    <td className="p-4">
                      {rsvp.attending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" /> No
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-stone-800 font-medium">{rsvp.attending ? rsvp.guests_count : '-'}</td>
                    <td className="p-4 text-stone-600 text-sm max-w-xs truncate" title={rsvp.message || ''}>
                      {rsvp.message || '-'}
                    </td>
                    <td className="p-4 text-stone-500 text-sm text-right">
                      {new Date(rsvp.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
