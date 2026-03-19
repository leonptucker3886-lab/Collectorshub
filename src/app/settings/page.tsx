'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import Navigation from '@/components/Navigation';
import { 
  Settings, User, Bell, Shield, HelpCircle, LogOut, 
  Trash2, Download, Moon, Globe, DollarSign, ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { exportData, collections } = useStore();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collectorvault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('collectorVault_data');
    handleSignOut();
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', value: '', onClick: () => router.push('/profile') },
        { icon: Bell, label: 'Notifications', value: 'On', onClick: () => {} },
        { icon: Shield, label: 'Privacy', value: '', onClick: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Globe, label: 'Language', value: 'English', onClick: () => {} },
        { icon: DollarSign, label: 'Currency', value: 'USD', onClick: () => {} },
        { icon: Moon, label: 'Dark Mode', value: 'On', onClick: () => {} },
      ]
    },
    {
      title: 'Data',
      items: [
        { icon: Download, label: 'Export Data', value: '', onClick: handleExport },
        { icon: Trash2, label: 'Delete Account', value: '', onClick: () => setShowDeleteConfirm(true), danger: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', value: '', onClick: () => {} },
        { icon: LogOut, label: 'Sign Out', value: '', onClick: handleSignOut },
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Summary */}
        <div className="card p-4 flex items-center gap-4 animate-fade-in">
          <div className="avatar" style={{ width: 50, height: 50 }}>
            <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)' }}>
              <User size={24} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold">{user?.displayName || 'Collector'}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p>
          </div>
          <button 
            onClick={() => router.push('/profile')}
            className="btn-secondary py-2 px-4 text-sm"
          >
            Edit
          </button>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIdx) => (
          <div key={section.title} className="animate-fade-in" style={{ animationDelay: `${sectionIdx * 0.05}s` }}>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              {section.title}
            </h3>
            <div className="card overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 transition-colors"
                    style={{ 
                      borderBottom: itemIdx < section.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                      color: item.danger ? 'var(--color-accent)' : 'var(--color-text-primary)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} style={{ color: item.danger ? 'var(--color-accent)' : 'var(--color-text-secondary)' }} />
                      <span className={item.danger ? '' : ''}>{item.label}</span>
                    </div>
                    {item.value ? (
                      <span style={{ color: 'var(--color-text-secondary)' }}>{item.value}</span>
                    ) : (
                      <ChevronRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E94560, #FF6B6B)' }}>
              <Shield size={16} />
            </div>
            <span className="font-semibold">CollectorVault</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Version 1.0.0 • Collection Inventory & Tracking System
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            © 2026 CollectorVault. All rights reserved.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Your Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
              <p className="text-xl font-bold">{collections.length}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Collections</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
              <p className="text-xl font-bold">{collections.reduce((sum, c) => sum + c.itemCount, 0)}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Items</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
              <p className="text-xl font-bold">{collections.length > 2 ? 'PRO' : 'FREE'}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Status</p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(233, 69, 96, 0.2)' }}>
                <Trash2 size={32} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Delete Account?</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                This will permanently delete all your collections, items, and data. This action cannot be undone.
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleDeleteAccount}
                className="w-full py-3 rounded-lg font-semibold"
                style={{ background: 'var(--color-accent)', color: 'white' }}
              >
                Yes, Delete Everything
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
