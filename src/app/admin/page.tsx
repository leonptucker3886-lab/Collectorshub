'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import Navigation from '@/components/Navigation';
import { 
  Users, ShoppingBag, DollarSign, Settings, MessageSquare, 
  Ban, Unlock, Trash2, Send, Palette, Save, RotateCcw,
  BarChart3, AlertTriangle, Check, X, Eye
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    allUsers, items, collections, isAdmin, banUser, unbanUser, 
    sendMessage, messages, appSettings, updateAppSettings, resetAppSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'marketplace' | 'messages' | 'settings'>('overview');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [banReason, setBanReason] = useState('');
  const [showBanModal, setShowBanModal] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
        <div className="card p-8 text-center">
          <AlertTriangle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 16px' }} />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>You do not have admin access.</p>
        </div>
      </div>
    );
  }

  const itemsForSale = items.filter(i => i.isForSale);
  const totalSalesValue = itemsForSale.reduce((sum, i) => sum + (i.salePrice || 0), 0);
  const totalCollectionValue = collections.reduce((sum, c) => sum + (c.totalValue || 0), 0);

  const handleSendMessage = () => {
    if (selectedUser && messageText.trim()) {
      sendMessage(selectedUser, messageText);
      setMessageText('');
      setSelectedUser(null);
    }
  };

  const handleBanUser = (userId: string) => {
    if (banReason.trim()) {
      banUser(userId, banReason);
      setBanReason('');
      setShowBanModal(null);
    }
  };

  const handleSaveSettings = () => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', appSettings.primaryColor);
    root.style.setProperty('--color-accent', appSettings.accentColor);
    root.style.setProperty('--color-background', appSettings.backgroundColor);
    root.style.setProperty('--color-surface', appSettings.surfaceColor);
    root.style.setProperty('--color-text', appSettings.textPrimary);
    root.style.setProperty('--color-text-secondary', appSettings.textSecondary);
    root.style.setProperty('--color-success', appSettings.successColor);
    root.style.setProperty('--color-warning', appSettings.warningColor);
    root.style.setProperty('--color-error', appSettings.errorColor);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--color-accent)', color: 'white' }}>
              ADMIN
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto scroll-container pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'gradient-accent' : ''
              }`}
              style={{ 
                background: activeTab === tab.id ? 'linear-gradient(135deg, #E94560, #FF6B6B)' : 'var(--color-surface)',
                color: activeTab === tab.id ? 'white' : 'var(--color-text)'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4">
                <Users size={24} style={{ color: 'var(--color-accent)', marginBottom: '8px' }} />
                <p className="text-2xl font-bold">{allUsers.length}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Users</p>
              </div>
              <div className="card p-4">
                <ShoppingBag size={24} style={{ color: 'var(--color-warning)', marginBottom: '8px' }} />
                <p className="text-2xl font-bold">{itemsForSale.length}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Items for Sale</p>
              </div>
              <div className="card p-4">
                <DollarSign size={24} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
                <p className="text-2xl font-bold">${totalSalesValue.toLocaleString()}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Sales Value</p>
              </div>
              <div className="card p-4">
                <BarChart3 size={24} style={{ color: 'var(--color-accent)', marginBottom: '8px' }} />
                <p className="text-2xl font-bold">${totalCollectionValue.toLocaleString()}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Collections</p>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {collections.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--color-surface-elevated)' }}>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{c.itemCount} items</p>
                    </div>
                    <span className="text-sm font-mono" style={{ color: 'var(--color-success)' }}>
                      ${c.totalValue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-semibold mb-4">User Management</h3>
              <div className="space-y-2">
                {allUsers.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                    No users registered yet.
                  </p>
                ) : (
                  allUsers.map(u => (
                    <div key={u.uid} className="flex items-center justify-between p-3 rounded" style={{ background: 'var(--color-surface-elevated)' }}>
                      <div>
                        <p className="font-medium">{u.displayName || u.username || u.email}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{u.email}</p>
                        <div className="flex gap-2 mt-1">
                          {u.isPremium && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--color-warning)', color: 'black' }}>Premium</span>}
                          {u.isSeller && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--color-success)', color: 'black' }}>Seller</span>}
                          {u.isBanned && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--color-error)', color: 'white' }}>Banned</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {u.isBanned ? (
                          <button onClick={() => unbanUser(u.uid)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1">
                            <Unlock size={14} /> Unban
                          </button>
                        ) : (
                          <button onClick={() => setShowBanModal(u.uid)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
                            <Ban size={14} /> Ban
                          </button>
                        )}
                        <button onClick={() => setSelectedUser(u.uid)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1">
                          <MessageSquare size={14} /> Message
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Marketplace Listings</h3>
              <div className="space-y-2">
                {itemsForSale.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                    No items for sale yet.
                  </p>
                ) : (
                  itemsForSale.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded" style={{ background: 'var(--color-surface-elevated)' }}>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Sale Price: ${item.salePrice?.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-mono" style={{ color: 'var(--color-success)' }}>
                        ${item.estimatedValue?.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Admin Messages</h3>
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                    No messages yet.
                  </p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded ${msg.read ? '' : 'border-l-4'}`} 
                      style={{ 
                        background: 'var(--color-surface-elevated)',
                        borderColor: msg.read ? 'transparent' : 'var(--color-accent)'
                      }}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{msg.fromAdmin ? 'To User' : 'From User'}</p>
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette size={20} /> App Customization
                </h3>
                <button onClick={resetAppSettings} className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Primary Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.primaryColor}
                      onChange={(e) => updateAppSettings({ primaryColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.primaryColor}
                      onChange={(e) => updateAppSettings({ primaryColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Accent Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.accentColor}
                      onChange={(e) => updateAppSettings({ accentColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.accentColor}
                      onChange={(e) => updateAppSettings({ accentColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.backgroundColor}
                      onChange={(e) => updateAppSettings({ backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.backgroundColor}
                      onChange={(e) => updateAppSettings({ backgroundColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Surface Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.surfaceColor}
                      onChange={(e) => updateAppSettings({ surfaceColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.surfaceColor}
                      onChange={(e) => updateAppSettings({ surfaceColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Text Primary</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.textPrimary}
                      onChange={(e) => updateAppSettings({ textPrimary: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.textPrimary}
                      onChange={(e) => updateAppSettings({ textPrimary: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Text Secondary</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.textSecondary}
                      onChange={(e) => updateAppSettings({ textSecondary: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.textSecondary}
                      onChange={(e) => updateAppSettings({ textSecondary: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Success Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.successColor}
                      onChange={(e) => updateAppSettings({ successColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.successColor}
                      onChange={(e) => updateAppSettings({ successColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Warning Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.warningColor}
                      onChange={(e) => updateAppSettings({ warningColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.warningColor}
                      onChange={(e) => updateAppSettings({ warningColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Error Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={appSettings.errorColor}
                      onChange={(e) => updateAppSettings({ errorColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={appSettings.errorColor}
                      onChange={(e) => updateAppSettings({ errorColor: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <button onClick={handleSaveSettings} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Save size={18} /> Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Message Modal */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Send Message</h3>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="input mb-4"
              placeholder="Type your message..."
              rows={4}
            />
            <div className="flex gap-2">
              <button onClick={() => setSelectedUser(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSendMessage} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="modal-backdrop" onClick={() => setShowBanModal(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Ban User</h3>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="input mb-4"
              placeholder="Reason for banning..."
              rows={4}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowBanModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleBanUser(showBanModal)} className="btn-primary flex-1 flex items-center justify-center gap-2" style={{ background: 'var(--color-error)' }}>
                <Ban size={16} /> Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
