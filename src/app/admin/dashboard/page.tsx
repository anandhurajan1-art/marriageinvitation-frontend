"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Edit, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns'; // Need to install date-fns

interface Invitation {
  id: string;
  template: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  venue: string;
  is_public: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await api.get('/invitations');
      setInvitations(res.data);
    } catch (error) {
      console.error('Failed to fetch invitations', error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/invitations/${deleteConfirmId}`);
      setInvitations(invitations.filter((inv) => inv.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error: any) {
      console.error('Failed to delete invitation', error);
      alert(error.response?.data?.error || 'Failed to delete invitation');
      setDeleteConfirmId(null);
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/invitation/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await api.put('/auth/change-password', passwordData);
      alert('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ old_password: '', new_password: '' });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-800">Invitations</h1>
          <p className="text-stone-500">Manage your created wedding invitations</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="text-stone-600 hover:text-stone-900 px-4 py-2 font-medium"
          >
            Change Password
          </button>
          <Link 
            href="/admin/create" 
            className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors font-medium"
          >
            Create New
          </Link>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Old Password</label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"} required
                    value={passwordData.old_password}
                    onChange={e => setPasswordData({...passwordData, old_password: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} required minLength={6}
                    value={passwordData.new_password}
                    onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-stone-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 disabled:opacity-50"
                >
                  {passwordLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (

        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
        </div>
      ) : invitations.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500 mb-4">No invitations created yet.</p>
          <Link 
            href="/admin/create" 
            className="text-stone-800 font-medium hover:underline"
          >
            Create your first invitation
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="p-4 font-medium text-stone-600">Couple</th>
                  <th className="p-4 font-medium text-stone-600">Wedding Date</th>
                  <th className="p-4 font-medium text-stone-600">Status</th>
                  <th className="p-4 font-medium text-stone-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={inv.id} 
                    className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-stone-800">{inv.groom_name} & {inv.bride_name}</div>
                      <div className="text-sm text-stone-500 truncate max-w-xs">{inv.venue}</div>
                    </td>
                    <td className="p-4 text-stone-600">
                      {new Date(inv.wedding_date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        inv.is_public ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.is_public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleShare(inv.id)}
                          className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Copy Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <Link 
                          href={`/invitation/${inv.id}`}
                          target="_blank"
                          className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/edit/${inv.id}`}
                          className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirmId(inv.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Delete Invitation?</h2>
            <p className="text-stone-500 mb-6">Are you sure you want to permanently delete this invitation? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
