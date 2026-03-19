'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Collection, Item, WishListItem, UserProfile, InsuranceInfo, CollectionType, AdminMessage, AppSettings } from '@/lib/types';
import { auth } from '@/lib/firebase';

const ADMIN_EMAIL = 'leonptucker3886@gmail.com';

const DEFAULT_APP_SETTINGS: AppSettings = {
  primaryColor: '#E94560',
  accentColor: '#FF6B6B',
  backgroundColor: '#0F0F1A',
  surfaceColor: '#1A1A2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  successColor: '#4ADE80',
  warningColor: '#FFB800',
  errorColor: '#EF4444',
  logo: '',
  siteName: 'CollectorVault'
};

interface StoreContextType {
  collections: Collection[];
  items: Item[];
  wishList: WishListItem[];
  userProfile: UserProfile | null;
  notes: string;
  messages: AdminMessage[];
  appSettings: AppSettings;
  allUsers: UserProfile[];
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
  isAdmin: () => boolean;
  canAddCollection: () => boolean;
  canSell: () => boolean;
  exportData: () => string;
  sendMessage: (userId: string, message: string) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  resetAppSettings: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export function StoreProvider({ children }: { children: ReactNode }) {
  const loadFromStorage = () => {
    if (typeof window === 'undefined') return { collections: [], items: [], wishList: [], userProfile: null, notes: '', messages: [], appSettings: DEFAULT_APP_SETTINGS, allUsers: [] };
    const stored = localStorage.getItem('collectorVault_data');
    if (stored) {
      const data = JSON.parse(stored);
      return {
        collections: data.collections || [],
        items: data.items || [],
        wishList: data.wishList || [],
        userProfile: data.userProfile || null,
        notes: data.notes || '',
        messages: data.messages || [],
        appSettings: data.appSettings || DEFAULT_APP_SETTINGS,
        allUsers: data.allUsers || []
      };
    }
    return { collections: [], items: [], wishList: [], userProfile: null, notes: '', messages: [], appSettings: DEFAULT_APP_SETTINGS, allUsers: [] };
  };

  const initialData = loadFromStorage();
  const [collections, setCollections] = useState<Collection[]>(initialData.collections);
  const [items, setItems] = useState<Item[]>(initialData.items);
  const [wishList, setWishList] = useState<WishListItem[]>(initialData.wishList);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialData.userProfile);
  const [notes, setNotes] = useState(initialData.notes);
  const [messages, setMessages] = useState<AdminMessage[]>(initialData.messages);
  const [appSettings, setAppSettings] = useState(initialData.appSettings);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(initialData.allUsers);

  useEffect(() => {
    const data = { collections, items, wishList, userProfile, notes, messages, appSettings, allUsers };
    localStorage.setItem('collectorVault_data', JSON.stringify(data));
  }, [collections, items, wishList, userProfile, notes, messages, appSettings, allUsers]);

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
    const isAdminEmail = updates.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    setUserProfile(prev => prev ? { ...prev, ...updates, isAdmin: isAdminEmail ? true : (prev.isAdmin || false) } : {
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
      isAdmin: isAdminEmail,
      isBanned: false,
      banReason: '',
      bannedAt: null,
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
    if (isAdmin()) return true;
    return userProfile?.isPremium || false;
  };

  const canAddCollection = () => {
    if (userProfile?.isPremium || isAdmin()) return true;
    return collections.length < 2;
  };

  const canSell = (): boolean => {
    if (isAdmin()) return true;
    return !!(userProfile?.isPremium && userProfile?.isSeller && userProfile?.sellerAgreementAccepted);
  };

  const isAdmin = (): boolean => {
    const currentEmail = auth.currentUser?.email?.toLowerCase() || userProfile?.email?.toLowerCase();
    return currentEmail === ADMIN_EMAIL.toLowerCase() || userProfile?.isAdmin || false;
  };

  const sendMessage = (userId: string, message: string) => {
    const newMessage: AdminMessage = {
      id: generateId(),
      userId,
      fromAdmin: isAdmin(),
      message,
      read: false,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const banUser = (userId: string, reason: string) => {
    setAllUsers(prev => prev.map(u => 
      u.uid === userId ? { ...u, isBanned: true, banReason: reason, bannedAt: new Date() } : u
    ));
  };

  const unbanUser = (userId: string) => {
    setAllUsers(prev => prev.map(u => 
      u.uid === userId ? { ...u, isBanned: false, banReason: '', bannedAt: null } : u
    ));
  };

  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings((prev: AppSettings) => ({ ...prev, ...settings }));
  };

  const resetAppSettings = () => {
    setAppSettings(DEFAULT_APP_SETTINGS);
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
      isAdmin,
      canAddCollection,
      canSell,
      exportData,
      messages,
      appSettings,
      allUsers,
      sendMessage,
      banUser,
      unbanUser,
      updateAppSettings,
      resetAppSettings
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
