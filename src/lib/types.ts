export type CollectionType = 
  | 'stamps' 
  | 'coins' 
  | 'sports' 
  | 'trading-cards' 
  | 'pokemon' 
  | 'magic' 
  | 'nfts'
  | 'watches'
  | 'paper-currency'
  | 'toys'
  | 'action-figures'
  | 'video-games'
  | 'electronics'
  | 'records'
  | 'custom';

export type ItemCondition = 'mint' | 'near-mint' | 'excellent' | 'good' | 'fair' | 'poor';

export interface Collection {
  id: string;
  userId: string;
  name: string;
  type: CollectionType;
  description: string;
  coverImage: string;
  itemCount: number;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  collectionId: string;
  userId: string;
  name: string;
  description: string;
  photos: string[];
  categoryAttributes: Record<string, string>;
  purchasePrice: number;
  estimatedValue: number;
  condition: ItemCondition;
  dateAcquired: string;
  serialNumber: string;
  certificate: string;
  location: string;
  notes: string;
  isForSale: boolean;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL: string;
  isAnonymous: boolean;
  isPremium: boolean;
  isSeller: boolean;
  sellerAgreementAccepted: boolean;
  sellerSince: Date | null;
  isAdmin: boolean;
  isBanned: boolean;
  banReason: string;
  bannedAt: Date | null;
  createdAt: Date;
  insuranceInfo: InsuranceInfo;
}

export interface InsuranceInfo {
  policyNumber: string;
  coverageAmount: number;
  provider: string;
  expirationDate: string;
  notes: string;
}

export interface WishListItem {
  id: string;
  userId: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  estimatedPrice: number;
  notes: string;
  createdAt: Date;
}

export interface AdminMessage {
  id: string;
  userId: string;
  fromAdmin: boolean;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AppSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  logo: string;
  siteName: string;
}

export interface CollectionTypeInfo {
  id: CollectionType;
  name: string;
  icon: string;
  attributes: string[];
}

export const COLLECTION_TYPES: CollectionTypeInfo[] = [
  { id: 'stamps', name: 'Stamps', icon: '📯', attributes: ['country', 'year', 'condition', 'perforated', 'gummed', 'color', 'printRun'] },
  { id: 'coins', name: 'Coins', icon: '🪙', attributes: ['country', 'year', 'mintMark', 'metal', 'weight', 'diameter', 'denomination'] },
  { id: 'sports', name: 'Sports Memorabilia', icon: '🏆', attributes: ['sport', 'team', 'player', 'gameUsed', 'autographed', 'jerseyNumber'] },
  { id: 'trading-cards', name: 'Trading Cards', icon: '🃏', attributes: ['setName', 'cardNumber', 'rarity', 'variant', 'grade'] },
  { id: 'pokemon', name: 'Pokémon Cards', icon: '🎴', attributes: ['setName', 'cardNumber', 'rarity', 'holo', 'grade', 'firstEdition'] },
  { id: 'magic', name: 'Magic: The Gathering', icon: '🧙', attributes: ['setName', 'cardNumber', 'rarity', 'foil', 'grade'] },
  { id: 'nfts', name: 'NFTs', icon: '🔷', attributes: ['blockchain', 'contractAddress', 'tokenId', 'collection'] },
  { id: 'watches', name: 'Watches', icon: '⌚', attributes: ['brand', 'model', 'movement', 'caseMaterial', 'bandMaterial', 'referenceNumber'] },
  { id: 'paper-currency', name: 'Paper Currency', icon: '💵', attributes: ['country', 'year', 'denomination', 'signature', 'series'] },
  { id: 'toys', name: 'Toys', icon: '🧸', attributes: ['brand', 'year', 'model', 'originalPackaging', 'limitedEdition'] },
  { id: 'action-figures', name: 'Action Figures', icon: '🦸', attributes: ['brand', 'series', 'character', 'scale', 'material'] },
  { id: 'video-games', name: 'Video Games', icon: '🎮', attributes: ['platform', 'genre', 'region', 'condition', 'complete'] },
  { id: 'electronics', name: 'Electronics', icon: '📱', attributes: ['brand', 'model', 'year', 'condition', 'serialNumber'] },
  { id: 'records', name: 'Records/Vinyl', icon: '📀', attributes: ['artist', 'album', 'year', 'genre', 'condition', 'speed'] },
  { id: 'custom', name: 'Custom', icon: '📦', attributes: ['custom1', 'custom2', 'custom3'] },
];

export const CONDITIONS: { value: ItemCondition; label: string }[] = [
  { value: 'mint', label: 'Mint' },
  { value: 'near-mint', label: 'Near Mint' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];
