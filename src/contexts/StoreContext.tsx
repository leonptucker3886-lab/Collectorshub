'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Collection, Item, WishListItem, UserProfile, InsuranceInfo, CollectionType } from '@/lib/types';

interface StoreContextType {
  collections: Collection[];
  items: Item[];
  wishList: WishListItem[];
  userProfile: UserProfile | null;
  notes: string;
  addCollection: (collection: Omit<Collection, 'id' | 'itemCount' | 'totalValue' | 'createdAt' | 'updatedAt'>) => boolean;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  addWishListItem: (item: Omit<WishListItem, 'id' | 'createdAt'>) => void;
  deleteWishListItem: (id: string) => void;
  updateNotes: (notes: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateInsuranceInfo: (info: InsuranceInfo) => void;
  getItemsByCollection: (collectionId: string) => Item[];
  getTotalValue: () => number;
  getTotalItems: () => number;
  isPremium: () => boolean;
  canAddCollection: () => boolean;
  canSell: () => boolean;
  exportData: () => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export function StoreProvider({ children }: { children: ReactNode }) {
  const loadFromStorage = () => {
    if (typeof window === 'undefined') return { collections: [], items: [], wishList: [], userProfile: null, notes: '' };
    const stored = localStorage.getItem('collectorVault_data');
    if (stored) {
      const data = JSON.parse(stored);
      return {
        collections: data.collections || [],
        items: data.items || [],
        wishList: data.wishList || [],
        userProfile: data.userProfile || null,
        notes: data.notes || ''
      };
    }
    return { collections: [], items: [], wishList: [], userProfile: null, notes: '' };
  };

  const initialData = loadFromStorage();
  const [collections, setCollections] = useState<Collection[]>(initialData.collections);
  const [items, setItems] = useState<Item[]>(initialData.items);
  const [wishList, setWishList] = useState<WishListItem[]>(initialData.wishList);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialData.userProfile);
  const [notes, setNotes] = useState(initialData.notes);

  useEffect(() => {
    const data = { collections, items, wishList, userProfile, notes };
    localStorage.setItem('collectorVault_data', JSON.stringify(data));
  }, [collections, items, wishList, userProfile, notes]);

  const addCollection = (collection: Omit<Collection, 'id' | 'itemCount' | 'totalValue' | 'createdAt' | 'updatedAt'>): boolean => {
    if (!canAddCollection()) {
      return false;
    }
    const newCollection: Collection = {
      ...collection,
      id: generateId(),
      itemCount: 0,
      totalValue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCollections(prev => [...prev, newCollection]);
    return true;
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
    ));
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    setItems(prev => prev.filter(i => i.collectionId !== id));
  };

  const addItem = (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Item = {
      ...item,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems(prev => [...prev, newItem]);
    
    // Update collection counts
    const collectionItems = items.filter(i => i.collectionId === item.collectionId);
    const totalValue = collectionItems.reduce((sum, i) => sum + (i.estimatedValue || 0), 0) + item.estimatedValue;
    updateCollection(item.collectionId, { 
      itemCount: collectionItems.length + 1,
      totalValue 
    });
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
    ));

    // Recalculate collection totals
    if (item.collectionId) {
      const collectionItems = items.map(i => i.id === id ? { ...i, ...updates } : i).filter(i => i.collectionId === item.collectionId);
      const totalValue = collectionItems.reduce((sum, i) => sum + (i.estimatedValue || 0), 0);
      updateCollection(item.collectionId, { totalValue });
    }
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    setItems(prev => prev.filter(i => i.id !== id));
    
    // Update collection counts
    if (item.collectionId) {
      const collectionItems = items.filter(i => i.collectionId === item.collectionId && i.id !== id);
      const totalValue = collectionItems.reduce((sum, i) => sum + (i.estimatedValue || 0), 0);
      updateCollection(item.collectionId, { 
        itemCount: collectionItems.length,
        totalValue 
      });
    }
  };

  const addWishListItem = (item: Omit<WishListItem, 'id' | 'createdAt'>) => {
    const newItem: WishListItem = {
      ...item,
      id: generateId(),
      createdAt: new Date(),
    };
    setWishList(prev => [...prev, newItem]);
  };

  const deleteWishListItem = (id: string) => {
    setWishList(prev => prev.filter(i => i.id !== id));
  };

  const updateNotes = (newNotes: string) => {
    setNotes(newNotes);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...updates } : {
      uid: '',
      email: '',
      displayName: '',
      username: '',
      photoURL: '',
      isAnonymous: false,
      isPremium: false,
      isSeller: false,
      sellerAgreementAccepted: false,
      sellerSince: null,
      createdAt: new Date(),
      insuranceInfo: {
        policyNumber: '',
        coverageAmount: 0,
        provider: '',
        expirationDate: '',
        notes: ''
      },
      ...updates
    });
  };

  const updateInsuranceInfo = (info: InsuranceInfo) => {
    setUserProfile(prev => prev ? { 
      ...prev, 
      insuranceInfo: info 
    } : null);
  };

  const getItemsByCollection = (collectionId: string) => {
    return items.filter(i => i.collectionId === collectionId);
  };

  const getTotalValue = () => {
    return items.reduce((sum, i) => sum + (i.estimatedValue || 0), 0);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const isPremium = () => {
    return userProfile?.isPremium || false;
  };

  const canAddCollection = () => {
    if (userProfile?.isPremium) return true;
    return collections.length < 2;
  };

  const canSell = (): boolean => {
    return !!(userProfile?.isPremium && userProfile?.isSeller && userProfile?.sellerAgreementAccepted);
  };

  const exportData = () => {
    return JSON.stringify({ collections, items, wishList, userProfile, notes }, null, 2);
  };

  return (
    <StoreContext.Provider value={{
      collections,
      items,
      wishList,
      userProfile,
      notes,
      addCollection,
      updateCollection,
      deleteCollection,
      addItem,
      updateItem,
      deleteItem,
      addWishListItem,
      deleteWishListItem,
      updateNotes,
      updateUserProfile,
      updateInsuranceInfo,
      getItemsByCollection,
      getTotalValue,
      getTotalItems,
      isPremium,
      canAddCollection,
      canSell,
      exportData
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
