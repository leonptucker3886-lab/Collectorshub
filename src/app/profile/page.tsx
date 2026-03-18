'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import Navigation from '@/components/Navigation';
import { 
  User, Camera, Edit2, Shield, DollarSign, FolderOpen, 
  Package, FileText, Download, Heart, Plus, X,
  FileCheck, Settings, ChevronRight, Trash2, Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProfilePage() {
  const { user, signOut, isDemo } = useAuth();
  const router = useRouter();
  const {
    collections, items, wishList, notes, userProfile,
    updateNotes, updateUserProfile, updateInsuranceInfo,
    addWishListItem, deleteWishListItem, getTotalValue, getTotalItems, isPremium, exportData
  } = useStore();

  const [activeSection, setActiveSection] = useState<'dashboard' | 'notes' | 'wishlist' | 'insurance'>('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: userProfile?.username || '',
    displayName: userProfile?.displayName || '',
    isAnonymous: userProfile?.isAnonymous || false,
    postToCommunity: false
  });
  const [newWishItem, setNewWishItem] = useState({ name: '', priority: 'medium' as 'high' | 'medium' | 'low', estimatedPrice: 0, notes: '' });
  const [showAddWish, setShowAddWish] = useState(false);
  const [insuranceForm, setInsuranceForm] = useState({
    policyNumber: userProfile?.insuranceInfo?.policyNumber || '',
    coverageAmount: userProfile?.insuranceInfo?.coverageAmount || 0,
    provider: userProfile?.insuranceInfo?.provider || '',
    expirationDate: userProfile?.insuranceInfo?.expirationDate || '',
    notes: userProfile?.insuranceInfo?.notes || ''
  });
  const [notesContent, setNotesContent] = useState(notes);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user && !isDemo) {
      router.push('/login');
    }
  }, [user, isDemo, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateNotes(notesContent);
    }, 500);
    return () => clearTimeout(timer);
  }, [notesContent]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateUserProfile({ photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUserProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collectorvault-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddWish = () => {
    if (newWishItem.name) {
      addWishListItem({
        userId: user?.uid || 'demo',
        ...newWishItem
      });
      setNewWishItem({ name: '', priority: 'medium', estimatedPrice: 0, notes: '' });
      setShowAddWish(false);
    }
  };

  const handleSaveInsurance = () => {
    updateInsuranceInfo(insuranceForm);
  };

  const chartData = collections.map(c => ({
    name: c.name.length > 8 ? c.name.substring(0, 8) + '...' : c.name,
    value: c.totalValue
  }));

  if (!user && !isDemo) {
    return null;
  }

  const totalValue = getTotalValue();
  const totalItems = getTotalItems();
  const premium = isPremium();

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E94560, #FF6B6B)' }}>
              <Shield size={22} />
            </div>
            <div>
              <h1 className="font-semibold text-lg">CollectorVault</h1>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Your Collection HQ</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="p-2 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <Settings size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <section className="card p-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="avatar">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)' }}>
                    <User size={40} style={{ color: 'var(--color-text-secondary)' }} />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-accent)' }}
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="file-input"
              />
            </div>

            <div className="flex-1">
              {isEditingProfile ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedProfile.displayName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                    className="input"
                    placeholder="Display Name"
                  />
                  <input
                    type="text"
                    value={editedProfile.username}
                    onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                    className="input"
                    placeholder="Username"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Stay Anonymous</span>
                    <div
                      className={`toggle ${editedProfile.isAnonymous ? 'active' : ''}`}
                      onClick={() => setEditedProfile({ ...editedProfile, isAnonymous: !editedProfile.isAnonymous })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2">
                      <Check size={16} /> Save
                    </button>
                    <button onClick={() => setIsEditingProfile(false)} className="btn-secondary flex-1 py-2">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {editedProfile.displayName || user?.displayName || 'Collector'}
                    </h2>
                    <button onClick={() => setIsEditingProfile(true)} className="p-1 rounded">
                      <Edit2 size={14} style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>@{editedProfile.username || 'username'}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    {premium && <span className="badge badge-premium">Premium</span>}
                    {editedProfile.isAnonymous && (
                      <span className="badge" style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)' }}>
                        Anonymous
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Dashboard Stats */}
        <section className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card p-4 text-center">
            <FolderOpen size={24} style={{ color: 'var(--color-accent)', margin: '0 auto 8px' }} />
            <p className="text-2xl font-bold font-mono">{collections.length}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Collections</p>
          </div>
          <div className="card p-4 text-center">
            <Package size={24} style={{ color: 'var(--color-success)', margin: '0 auto 8px' }} />
            <p className="text-2xl font-bold font-mono">{totalItems}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Items</p>
          </div>
          <div className="card p-4 text-center">
            <DollarSign size={24} style={{ color: 'var(--color-warning)', margin: '0 auto 8px' }} />
            <p className="text-2xl font-bold font-mono">${totalValue.toLocaleString()}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Value</p>
          </div>
        </section>

        {/* Section Tabs */}
        <section className="flex gap-2 overflow-x-auto pb-2 scroll-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Package },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'wishlist', label: 'Wish List', icon: Heart },
            { id: 'insurance', label: 'Insurance', icon: FileCheck },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === tab.id ? 'gradient-accent' : ''
                }`}
                style={{ 
                  background: activeSection === tab.id ? 'linear-gradient(135deg, #E94560, #FF6B6B)' : 'var(--color-surface)',
                  color: activeSection === tab.id ? 'white' : 'var(--color-text-secondary)'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </section>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <section className="space-y-4 animate-fade-in">
            {chartData.length > 0 && (
              <div className="card p-4">
                <h3 className="text-sm font-semibold mb-4">Collection Values</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--color-surface)', 
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                      formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Value']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="var(--color-accent)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <button onClick={handleExport} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download size={18} />
              Export Collection Data
            </button>

            {collections.length === 0 && (
              <div className="card p-8 text-center">
                <FolderOpen size={48} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Start tracking your collections by adding your first one
                </p>
                <button 
                  onClick={() => router.push('/collections')}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Collection
                </button>
              </div>
            )}
          </section>
        )}

        {/* Notes Section */}
        {activeSection === 'notes' && (
          <section className="animate-fade-in">
            <div className="card p-4">
              <h3 className="text-sm font-semibold mb-3">Personal Notes</h3>
              <textarea
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
                className="input min-h-[200px] resize-none"
                placeholder="Write your notes here... (auto-saved)"
                style={{ background: 'var(--color-surface-elevated)' }}
              />
            </div>
          </section>
        )}

        {/* Wishlist Section */}
        {activeSection === 'wishlist' && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Your Wish List</h3>
              <button 
                onClick={() => setShowAddWish(!showAddWish)}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {showAddWish && (
              <div className="card p-4 space-y-3">
                <input
                  type="text"
                  value={newWishItem.name}
                  onChange={(e) => setNewWishItem({ ...newWishItem, name: e.target.value })}
                  className="input"
                  placeholder="Item name"
                />
                <select
                  value={newWishItem.priority}
                  onChange={(e) => setNewWishItem({ ...newWishItem, priority: e.target.value as any })}
                  className="select"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <input
                  type="number"
                  value={newWishItem.estimatedPrice || ''}
                  onChange={(e) => setNewWishItem({ ...newWishItem, estimatedPrice: Number(e.target.value) })}
                  className="input"
                  placeholder="Estimated price ($)"
                />
                <textarea
                  value={newWishItem.notes}
                  onChange={(e) => setNewWishItem({ ...newWishItem, notes: e.target.value })}
                  className="input"
                  placeholder="Notes"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddWish} className="btn-primary flex-1">Add to Wish List</button>
                  <button onClick={() => setShowAddWish(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            {wishList.length === 0 && !showAddWish && (
              <div className="card p-8 text-center">
                <Heart size={48} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 className="text-lg font-semibold mb-2">No Wish List Items</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Add items you&apos;re looking for
                </p>
              </div>
            )}

            {wishList.map(item => (
              <div key={item.id} className="card p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className={`badge ${
                      item.priority === 'high' ? 'badge-premium' : 
                      item.priority === 'medium' ? 'badge-success' : ''
                    }`} style={{ 
                      background: item.priority === 'high' ? 'rgba(255, 184, 0, 0.2)' : 
                                item.priority === 'medium' ? 'rgba(0, 217, 165, 0.2)' : 'var(--color-surface-elevated)',
                      color: item.priority === 'high' ? '#FFB800' : 
                             item.priority === 'medium' ? 'var(--color-success)' : 'var(--color-text-secondary)'
                    }}>
                      {item.priority}
                    </span>
                  </div>
                  {item.estimatedPrice > 0 && (
                    <p className="text-sm font-mono mt-1" style={{ color: 'var(--color-success)' }}>
                      ~${item.estimatedPrice.toLocaleString()}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{item.notes}</p>
                  )}
                </div>
                <button 
                  onClick={() => deleteWishListItem(item.id)}
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--color-accent)' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Insurance Section */}
        {activeSection === 'insurance' && (
          <section className="animate-fade-in">
            <div className="card p-4 space-y-4">
              <h3 className="text-sm font-semibold">Insurance Information</h3>
              
              <div>
                <label className="label">Policy Number</label>
                <input
                  type="text"
                  value={insuranceForm.policyNumber}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, policyNumber: e.target.value })}
                  className="input"
                  placeholder="POL-XXXXX-XXXXX"
                />
              </div>

              <div>
                <label className="label">Provider</label>
                <input
                  type="text"
                  value={insuranceForm.provider}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, provider: e.target.value })}
                  className="input"
                  placeholder="Insurance company name"
                />
              </div>

              <div>
                <label className="label">Coverage Amount ($)</label>
                <input
                  type="number"
                  value={insuranceForm.coverageAmount || ''}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, coverageAmount: Number(e.target.value) })}
                  className="input font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="label">Expiration Date</label>
                <input
                  type="date"
                  value={insuranceForm.expirationDate}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, expirationDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Notes</label>
                <textarea
                  value={insuranceForm.notes}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, notes: e.target.value })}
                  className="input"
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              <button onClick={handleSaveInsurance} className="btn-primary w-full flex items-center justify-center gap-2">
                <Check size={18} />
                Save Insurance Info
              </button>
            </div>
          </section>
        )}
      </main>

      <Navigation />
    </div>
  );
}
