'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import Navigation from '@/components/Navigation';
import { COLLECTION_TYPES, CONDITIONS, Collection, Item, CollectionType } from '@/lib/types';
import { 
  Plus, Search, Filter, Grid, List, ChevronRight, 
  X, Image, DollarSign, ExternalLink, Trash2, Edit2,
  MoreVertical, Tag, Calendar, MapPin, Award
} from 'lucide-react';

export default function CollectionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    collections, items, addCollection, deleteCollection, 
    addItem, updateItem, deleteItem, getItemsByCollection, isPremium, canAddCollection
  } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [newCollection, setNewCollection] = useState({ name: '', type: 'stamps' as CollectionType, description: '', coverImage: '' });
  const [newItem, setNewItem] = useState({
    name: '', description: '', photos: [] as string[], purchasePrice: 0, estimatedValue: 0,
    condition: 'good' as const, dateAcquired: '', serialNumber: '', certificate: '', location: '', notes: '',
    isForSale: false, salePrice: 0, categoryAttributes: {} as Record<string, string>
  });

  if (!user) {
    return null;
  }

  const premium = isPremium();
  const canAdd = canAddCollection();

  const handleCreateCollection = () => {
    if (newCollection.name && canAdd) {
      addCollection({
        userId: user?.uid || '',
        ...newCollection
      });
      setNewCollection({ name: '', type: 'stamps', description: '', coverImage: '' });
      setShowAddCollection(false);
    }
  };

  const handleAddItem = (collectionId: string) => {
    if (newItem.name) {
      addItem({
        userId: user?.uid || '',
        collectionId,
        ...newItem
      });
      setNewItem({
        name: '', description: '', photos: [] as string[], purchasePrice: 0, estimatedValue: 0,
        condition: 'good', dateAcquired: '', serialNumber: '', certificate: '', location: '', notes: '',
        isForSale: false, salePrice: 0, categoryAttributes: {}
      });
      setShowAddItem(null);
    }
  };

  const collectionItems = selectedCollection ? getItemsByCollection(selectedCollection.id) : [];
  const selectedTypeInfo = COLLECTION_TYPES.find(t => t.id === (selectedCollection?.type || newCollection.type));

  const filteredItems = collectionItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold">Collections</h1>
          <button 
            onClick={() => setShowAddCollection(true)}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!selectedCollection ? (
          <>
            {/* Collections Grid */}
            {collections.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-surface-elevated)' }}>
                  <Plus size={32} style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {premium ? 'Start building your collection empire!' : 'Create your first collection to get started.'}
                </p>
                {!premium && collections.length <= 2 && (
                  <p className="text-xs mb-4" style={{ color: 'var(--color-warning)' }}>
                    Collections 1-2 free, Premium required for more
                  </p>
                )}
                <button 
                  onClick={() => setShowAddCollection(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {collections.map((collection, idx) => {
                  const typeInfo = COLLECTION_TYPES.find(t => t.id === collection.type);
                  return (
                    <div 
                      key={collection.id}
                      onClick={() => setSelectedCollection(collection)}
                      className="card p-4 cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="h-24 rounded-lg mb-3 flex items-center justify-center text-4xl" style={{ background: 'var(--color-surface-elevated)' }}>
                        {typeInfo?.icon || '📦'}
                      </div>
                      <h3 className="font-semibold truncate">{collection.name}</h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {collection.itemCount} items
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-mono" style={{ color: 'var(--color-success)' }}>
                          ${collection.totalValue.toLocaleString()}
                        </span>
                        <ChevronRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Premium Banner */}
            {!premium && collections.length > 0 && (
              <div className="mt-6 card p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.05))', borderColor: 'var(--color-warning)' }}>
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--color-warning)' }}>Upgrade to Premium</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Unlock unlimited collections & marketplace</p>
                </div>
                <button 
                  onClick={() => router.push('/featured')}
                  className="btn-primary py-2 px-3 text-xs"
                >
                  Upgrade
                </button>
              </div>
            )}
          </>
        ) : (
          /* Collection Detail View */
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedCollection(null)}
              className="flex items-center gap-2 text-sm mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              ← Back to Collections
            </button>

            {/* Collection Header */}
            <div className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{selectedTypeInfo?.icon}</div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedCollection.name}</h2>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {selectedCollection.itemCount} items · ${selectedCollection.totalValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => deleteCollection(selectedCollection.id)}
                    className="p-2 rounded-lg"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {selectedCollection.description && (
                <p className="text-sm mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedCollection.description}
                </p>
              )}

              <button 
                onClick={() => setShowAddItem(selectedCollection.id)}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            {/* Search */}
            {collectionItems.length > 0 && (
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-12"
                  placeholder="Search items..."
                />
              </div>
            )}

            {/* Items List */}
            {filteredItems.length === 0 ? (
              <div className="card p-8 text-center">
                <Package size={48} style={{ color: 'var(--color-text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 className="text-lg font-semibold mb-2">No Items Yet</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Add your first item to this collection
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item, idx) => (
                  <div 
                    key={item.id}
                    className="card p-4 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <div className="flex gap-4">
                      <div 
                        className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'var(--color-surface-elevated)' }}
                      >
                        {item.photos[0] ? (
                          <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Image size={24} style={{ color: 'var(--color-text-secondary)' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold truncate">{item.name}</h4>
                            <span className={`badge ${item.condition === 'mint' ? 'badge-success' : ''}`} style={{ 
                              background: 'var(--color-surface-elevated)',
                              color: 'var(--color-text-secondary)',
                              fontSize: '10px'
                            }}>
                              {item.condition}
                            </span>
                          </div>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-1"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Value</p>
                            <p className="font-mono text-sm" style={{ color: 'var(--color-success)' }}>
                              ${item.estimatedValue.toLocaleString()}
                            </p>
                          </div>
                          {item.serialNumber && (
                            <div>
                              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>S/N</p>
                              <p className="font-mono text-xs">{item.serialNumber}</p>
                            </div>
                          )}
                        </div>

                        {/* eBay Link */}
                        <a 
                          href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs mt-2"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          <ExternalLink size={12} />
                          Check eBay
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Collection Modal */}
      {showAddCollection && (
        <div className="modal-backdrop" onClick={() => setShowAddCollection(false)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">New Collection</h2>
              <button onClick={() => setShowAddCollection(false)}>
                <X size={24} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Collection Name</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="input"
                  placeholder="My Collection"
                />
              </div>

              <div>
                <label className="label">Collection Type</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto scroll-container p-1">
                  {COLLECTION_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewCollection({ ...newCollection, type: type.id })}
                      className={`p-3 rounded-lg text-center transition-all ${
                        newCollection.type === type.id ? 'gradient-accent' : ''
                      }`}
                      style={{ 
                        background: newCollection.type === type.id ? 'linear-gradient(135deg, #E94560, #FF6B6B)' : 'var(--color-surface-elevated)',
                        border: newCollection.type === type.id ? 'none' : '1px solid var(--color-border)'
                      }}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs truncate">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Description (optional)</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="input"
                  placeholder="Describe your collection..."
                  rows={3}
                />
              </div>

              <button onClick={handleCreateCollection} className="btn-primary w-full">
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="modal-backdrop" onClick={() => setShowAddItem(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Item</h2>
              <button onClick={() => setShowAddItem(null)}>
                <X size={24} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto scroll-container pr-2">
              <div>
                <label className="label">Item Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="input"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="input"
                  placeholder="Description..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Purchase Price ($)</label>
                  <input
                    type="number"
                    value={newItem.purchasePrice || ''}
                    onChange={(e) => setNewItem({ ...newItem, purchasePrice: Number(e.target.value) })}
                    className="input font-mono"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="label">Estimated Value ($)</label>
                  <input
                    type="number"
                    value={newItem.estimatedValue || ''}
                    onChange={(e) => setNewItem({ ...newItem, estimatedValue: Number(e.target.value) })}
                    className="input font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Condition</label>
                  <select
                    value={newItem.condition}
                    onChange={(e) => setNewItem({ ...newItem, condition: e.target.value as any })}
                    className="select"
                  >
                    {CONDITIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Date Acquired</label>
                  <input
                    type="date"
                    value={newItem.dateAcquired}
                    onChange={(e) => setNewItem({ ...newItem, dateAcquired: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Serial Number</label>
                  <input
                    type="text"
                    value={newItem.serialNumber}
                    onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                    className="input"
                    placeholder="S/N"
                  />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="input"
                    placeholder="Storage location"
                  />
                </div>
              </div>

              <div>
                <label className="label">Certificate/Authentication</label>
                <input
                  type="text"
                  value={newItem.certificate}
                  onChange={(e) => setNewItem({ ...newItem, certificate: e.target.value })}
                  className="input"
                  placeholder="Certificate number"
                />
              </div>

              {/* Category-specific fields */}
              {selectedTypeInfo && selectedTypeInfo.attributes.map(attr => (
                <div key={attr}>
                  <label className="label">{attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  <input
                    type="text"
                    value={newItem.categoryAttributes[attr] || ''}
                    onChange={(e) => setNewItem({ 
                      ...newItem, 
                      categoryAttributes: { ...newItem.categoryAttributes, [attr]: e.target.value } 
                    })}
                    className="input"
                    placeholder={attr}
                  />
                </div>
              ))}

              <div>
                <label className="label">Notes</label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="input"
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>

              <button onClick={() => handleAddItem(showAddItem)} className="btn-primary w-full">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}

function Package({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <line x1="12" x2="12" y1="22" y2="12"/>
    </svg>
  );
}
