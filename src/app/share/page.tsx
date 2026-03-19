'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import Navigation from '@/components/Navigation';
import { 
  Share2, Link, Users, MessageCircle, Instagram, 
  Facebook, Percent, ArrowRight, Copy, Check, Zap,
  TrendingUp, ShoppingCart, Handshake, ShoppingBag
} from 'lucide-react';

export default function SharePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { collections, items, userProfile, getTotalValue, isPremium } = useStore();
  
  const [copied, setCopied] = useState(false);
  const [connectedSocial, setConnectedSocial] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const premium = isPremium();
  const totalValue = getTotalValue();

  const shareLink = `https://collectorvault.app/u/${userProfile?.username || 'user'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPlatforms = [
    { id: 'x', name: 'X', icon: (props: any) => <svg viewBox="0 0 24 24" width="20" height="20" {...props}><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, color: '#000000' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  ];

  const handleConnectSocial = (platformId: string) => {
    setConnectedSocial(platformId);
    setTimeout(() => setConnectedSocial(null), 2000);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold">Share & Trade</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Preview Card */}
        <section className="card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Your Public Profile</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar" style={{ width: 60, height: 60 }}>
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="avatar" style={{ width: 60, height: 60 }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)', borderRadius: '50%' }}>
                  <Users size={24} style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">
                {userProfile?.isAnonymous ? 'Anonymous Collector' : (userProfile?.displayName || user?.displayName || 'Collector')}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                @{userProfile?.username || 'username'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>
                {collections.length} collections · ${totalValue.toLocaleString()} total value
              </p>
            </div>
          </div>

          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Share your collection profile with others in the collector community
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="input flex-1 font-mono text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="btn-secondary p-3"
            >
              {copied ? <Check size={18} style={{ color: 'var(--color-success)' }} /> : <Copy size={18} />}
            </button>
          </div>
        </section>

        {/* Share Options */}
        <section className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-4">Share Profile</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {socialPlatforms.map(platform => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => handleConnectSocial(platform.id)}
                  className="card p-4 flex flex-col items-center gap-2"
                  style={{ borderColor: connectedSocial === platform.id ? platform.color : undefined }}
                >
                  <Icon size={24} style={{ color: platform.color }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{platform.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Trading Network */}
        <section className="card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E94560, #FF6B6B)' }}>
              <Handshake size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Trading Network</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Connect with other collectors</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
              <div className="flex items-center gap-3">
                <MessageCircle size={20} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <p className="font-medium text-sm">Trade Requests</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Connect with collectors</p>
                </div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
              <div className="flex items-center gap-3">
                <TrendingUp size={20} style={{ color: 'var(--color-success)' }} />
                <div>
                  <p className="font-medium text-sm">Price Comparisons</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>See market values</p>
                </div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
        </section>

        {/* Kickback Info */}
        <section className="card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFB800, #FFD700)' }}>
              <Percent size={20} style={{ color: '#1A1A2E' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">2% Platform Fee</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Low fees on all sales</p>
            </div>
          </div>

          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            When you sell items through our marketplace, a small 2% platform fee 
            helps support the platform. Keep more of your earnings.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
              <p className="text-2xl font-bold text-gradient">2%</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Platform Fee</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>98%</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>You Keep</p>
            </div>
          </div>
        </section>

        {/* Premium Upgrade */}
        {!premium && (
          <section className="card p-6 gradient-accent animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Zap size={24} />
              <div>
                <h2 className="text-lg font-semibold">Unlock Trading Features</h2>
                <p className="text-sm opacity-80">Upgrade to premium for full access</p>
              </div>
            </div>

            <ul className="text-sm space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <Check size={16} /> Create your own store
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} /> Feature on front page
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} /> List items for sale
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} /> Priority in trading network
              </li>
            </ul>

            <button 
              onClick={() => router.push('/featured')}
              className="w-full py-3 rounded-lg font-semibold"
              style={{ background: '#1A1A2E', color: 'white' }}
            >
              Upgrade to Premium
            </button>
          </section>
        )}

        {/* Premium Features */}
        {premium && (
          <section className="card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center badge-premium">
                <ShoppingBag size={20} style={{ color: '#1A1A2E' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Your Store</h2>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Manage your marketplace listings</p>
              </div>
            </div>

            <button 
              onClick={() => router.push('/featured')}
              className="btn-primary w-full"
            >
              Open Store Dashboard
            </button>
          </section>
        )}
      </main>

      <Navigation />
    </div>
  );
}
