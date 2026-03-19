'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import Navigation from '@/components/Navigation';
import { COLLECTION_TYPES } from '@/lib/types';
import { 
  Star, Zap, Crown, Shield, Plus, DollarSign, Eye, 
  ShoppingBag, TrendingUp, Users, ArrowRight, Lock,
  Check, ExternalLink, MessageCircle
} from 'lucide-react';

export default function FeaturedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { collections, items, isPremium, getTotalValue } = useStore();
  
  const [activeTab, setActiveTab] = useState<'featured' | 'store' | 'listings'>('featured');

  const premium = isPremium();

  if (!user) {
    return null;
  }

  const totalValue = getTotalValue();
  const itemsForSale = items.filter(i => i.isForSale);

  const featuredCollectors = [
    { id: 1, name: 'RareFinds_Larry', collections: 12, avatar: '🦊', value: '$2.4M' },
    { id: 2, name: 'VintageQueen', collections: 8, avatar: '👑', value: '$890K' },
    { id: 3, name: 'CardMaster99', collections: 15, avatar: '🃏', value: '$1.2M' },
    { id: 4, name: 'CoinCollector', collections: 6, avatar: '🪙', value: '$540K' },
    { id: 5, name: 'TimeKeeper', collections: 4, avatar: '⌚', value: '$1.8M' },
  ];

  const trendingListings = [
    { id: 1, name: 'Charizard Holo 1st Edition', price: 15000, seller: 'CardMaster99', type: 'pokemon' },
    { id: 2, name: 'Rolex Submariner 1969', price: 45000, seller: 'TimeKeeper', type: 'watches' },
    { id: 3, name: 'Black Lotus Alpha', price: 28000, seller: 'MTG_Pro', type: 'magic' },
    { id: 4, name: 'Penny Black Stamp', price: 8500, seller: 'StampLover', type: 'stamps' },
  ];

  if (!premium) {
    return (
      <div className="min-h-screen pb-24 flex flex-col" style={{ background: 'var(--color-background)' }}>
        <header className="glass sticky top-0 z-40 px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold">Featured</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-12">
          <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFB800, #FFD700)' }}>
            <Lock size={40} style={{ color: '#1A1A2E' }} />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-3">Premium Feature</h1>
          <p className="text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Upgrade to unlock the Featured tab and access premium marketplace features.
          </p>

          <div className="card p-6 w-full mb-6">
            <h3 className="font-semibold mb-4">Premium Benefits</h3>
            <ul className="space-y-3">
              {[
                { icon: ShoppingBag, text: 'Create your own store' },
                { icon: Star, text: 'Feature on front page' },
                { icon: DollarSign, text: 'List items for sale' },
                { icon: TrendingUp, text: 'Priority in search results' },
                { icon: Users, text: 'Trading network access' },
                { icon: Percent, text: 'Reduced fees on sales' },
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)' }}>
                    <benefit.icon size={16} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-primary w-full flex items-center justify-center gap-2 py-4">
            <Zap size={20} />
            Upgrade Now - $15/year
          </button>

          <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Or create 3+ collections to unlock premium for free
          </p>
        </main>

        <Navigation />
      </div>
    );
  }

  const handleAddListing = () => {
    router.push('/collections');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              <Crown size={16} style={{ color: 'white' }} />
            </div>
            <h1 className="text-xl font-semibold">Featured</h1>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', color: 'white' }}>PRO</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scroll-container">
          {[
            { id: 'featured', label: 'Featured', icon: Star },
            { id: 'store', label: 'My Store', icon: ShoppingBag },
            { id: 'listings', label: 'Listings', icon: DollarSign },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'gradient-accent' : ''
                }`}
                style={{ 
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #3B82F6, #60A5FA)' : 'var(--color-surface)',
                  color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Featured Tab */}
        {activeTab === 'featured' && (
          <section className="space-y-6">
            {/* Your Collection */}
            <div className="card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Your Storefront</h2>
                <button className="text-sm" style={{ color: 'var(--color-accent)' }}>Edit</button>
              </div>
              <div className="flex items-center gap-4">
                <div className="avatar-lg" style={{ width: 80, height: 80 }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)' }}>
                    <Users size={32} style={{ color: 'var(--color-text-secondary)' }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Your Collection Store</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{collections.length} collections</p>
                  <p className="font-mono text-sm mt-1" style={{ color: 'var(--color-success)' }}>${totalValue.toLocaleString()} total</p>
                </div>
              </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
                  <p className="font-bold text-lg">{itemsForSale.length}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>For Sale</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
                  <p className="font-bold text-lg">0</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Sold</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
                  <p className="font-bold text-lg">2%</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Fee</p>
                </div>
              </div>
            </div>

            {/* Featured Collectors */}
            <div className="card p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-semibold mb-4">Top Collectors</h2>
              <div className="space-y-3">
                {featuredCollectors.map((collector, idx) => (
                  <div key={collector.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
                    <span className="text-2xl">{collector.avatar}</span>
                    <div className="flex-1">
                      <p className="font-medium">{collector.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {collector.collections} collections
                      </p>
                    </div>
                    <span className="font-mono text-sm" style={{ color: 'var(--color-success)' }}>{collector.value}</span>
                    <button className="p-2 rounded-lg" style={{ background: 'var(--color-surface)' }}>
                      <Eye size={16} style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Listings */}
            <div className="card p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Trending Listings</h2>
                <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
              </div>
              <div className="space-y-3">
                {trendingListings.map(item => {
                  const typeInfo = COLLECTION_TYPES.find(t => t.id === item.type);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }}>
                      <div className="text-2xl">{typeInfo?.icon || '📦'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>by {item.seller}</p>
                      </div>
                      <span className="font-mono font-semibold" style={{ color: 'var(--color-success)' }}>
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Store Tab */}
        {activeTab === 'store' && (
          <section className="space-y-6">
            <div className="card p-6 text-center animate-fade-in">
              <ShoppingBag size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 16px' }} />
              <h2 className="text-xl font-semibold mb-2">Your Store</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Manage your listings and reach thousands of collectors
              </p>
              
              <button onClick={handleAddListing} className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus size={18} />
                Add New Listing
              </button>
            </div>

            <div className="card p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-semibold mb-3">Store Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
                  <p className="font-bold text-2xl" style={{ color: 'var(--color-success)' }}>${itemsForSale.reduce((sum, i) => sum + (i.salePrice || 0), 0).toLocaleString()}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Listings Value</p>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-elevated)' }}>
                  <p className="font-bold text-2xl">{itemsForSale.length}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Active Listings</p>
                </div>
              </div>
            </div>

            <div className="card p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold mb-3">Promote Your Store</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Boost your visibility and get featured on the front page
              </p>
              <button className="btn-secondary w-full">
                Learn About Promotions
              </button>
            </div>
          </section>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Your Listings</h2>
              <button onClick={handleAddListing} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                <Plus size={16} />
                New Listing
              </button>
            </div>

            {itemsForSale.length === 0 ? (
              <div className="card p-8 text-center">
                <DollarSign size={48} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Start selling items from your collection
                </p>
                <button onClick={handleAddListing} className="btn-primary inline-flex items-center gap-2">
                  <Plus size={18} />
                  Create First Listing
                </button>
              </div>
            ) : (
              itemsForSale.map(item => (
                <div key={item.id} className="card p-4">
                  <div className="flex gap-4">
                    {item.photos && item.photos.length > 0 ? (
                      <img src={item.photos[0]} alt="" className="w-20 h-20 rounded-lg object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)' }}>
                        <ShoppingBag size={24} style={{ color: 'var(--color-text-secondary)' }} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="font-mono text-lg mt-1" style={{ color: 'var(--color-success)' }}>
                        ${item.salePrice.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button className="btn-secondary py-1 px-3 text-xs">Edit</button>
                        <button className="btn-secondary py-1 px-3 text-xs" style={{ color: 'var(--color-accent)' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      <Navigation />
    </div>
  );
}

const Percent = ({ size, style }: { size: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="19" x2="5" y1="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);
