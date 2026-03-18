# CollectorVault - Collection Inventory & Tracking System

## Project Overview

**Project Name:** CollectorVault  
**Type:** Mobile-First Web Application (Progressive Web App)  
**Core Functionality:** A professional inventory management system for serious collectors to catalog, track, and manage their collections with detailed item attributes, pricing tracking, and community features.  
**Target Users:** Serious hobbyist collectors who maintain multiple collections and require professional-grade tracking tools.

---

## UI/UX Specification

### Layout Structure

**Navigation:** Bottom tab bar with 5 tabs
1. Profile (dashboard icon)
2. Collections (folder icon)
3. Share (share icon)
4. Featured (star icon - premium)
5. Settings (gear icon)

**Responsive Breakpoints:**
- Mobile: 320px - 767px (primary target)
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Visual Design

**Color Palette:**
- Primary: `#1A1A2E` (Deep Navy)
- Secondary: `#16213E` (Dark Blue)
- Accent: `#E94560` (Coral Red)
- Success: `#00D9A5` (Mint Green)
- Warning: `#FFB800` (Golden Yellow)
- Background: `#0F0F1A` (Near Black)
- Surface: `#1F1F35` (Dark Purple-Gray)
- Text Primary: `#FFFFFF`
- Text Secondary: `#A0A0B8`
- Border: `#2D2D4A`

**Typography:**
- Headings: "Outfit", sans-serif (Google Fonts)
- Body: "DM Sans", sans-serif (Google Fonts)
- Monospace: "JetBrains Mono" (for values/prices)
- H1: 28px, 700 weight
- H2: 22px, 600 weight
- H3: 18px, 600 weight
- Body: 15px, 400 weight
- Small: 13px, 400 weight
- Caption: 11px, 500 weight (uppercase for labels)

**Spacing System:**
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px

**Visual Effects:**
- Cards: 12px border-radius, subtle glow on hover
- Buttons: 8px border-radius, 200ms transitions
- Shadows: `0 4px 20px rgba(233, 69, 96, 0.15)` (accent glow)
- Glass effect: `backdrop-filter: blur(12px)` with 85% opacity backgrounds
- Gradient accents: `linear-gradient(135deg, #E94560, #FF6B6B)`

### Components

**App Shell:**
- Bottom navigation bar with icon + label
- Active tab has accent color highlight
- Safe area padding for mobile

**Cards:**
- Collection cards with thumbnail, name, item count, total value
- Item cards with image, title, condition, value
- Premium badge for locked features

**Buttons:**
- Primary: Accent gradient background, white text
- Secondary: Transparent with border
- Icon buttons: 44px minimum touch target

**Forms:**
- Floating labels
- Validation states (error: coral, success: mint)
- Image upload with drag-drop zone

**Modals:**
- Bottom sheet style on mobile
- Centered on desktop
- Backdrop blur effect

---

## Functionality Specification

### 1. Authentication (Firebase)

**Login Methods:**
- Email/Password
- Google OAuth
- Anonymous mode (view demo)

**Protected Routes:**
- All main app features require authentication
- Login screen with app branding

### 2. Profile Tab (Dashboard)

**User Profile Section:**
- Profile picture (upload, crop, preview)
- Username (editable)
- Display name (editable)
- Anonymous toggle switch
- "Post to Community" toggle

**Dashboard Stats:**
- Total collections count
- Total items count
- Total collection value (sum of all items)
- Premium status indicator
- Collection value chart (bar chart by collection)

**Quick Actions:**
- Add new collection button
- Export collection data (JSON/CSV)
- Insurance information button

**Notes Section:**
- Free-form text area for personal notes
- Auto-save functionality

**Wish List:**
- Add items wanted
- Priority levels (High, Medium, Low)
- Estimated price range
- Link to marketplace searches

**Insurance Information:**
- Policy number
- Coverage amount
- Provider name
- Expiration date
- Notes field

### 3. Collections Tab

**Collection Types (predefined):**
- Stamps
- Coins
- Sports Memorabilia
- Trading Cards
- Pokémon Cards
- Magic: The Gathering
- NFTs
- Watches
- Paper Currency
- Toys
- Action Figures
- Video Games
- Electronics
- Records/Vinyl
- Custom (user-defined)

**Collection Management:**
- Create new collection with type selection
- Custom collection name
- Cover image (optional)
- Description

**Item Management:**
- Add item with:
  - Name (required)
  - Description
  - Multiple photos (up to 10)
  - Category-specific attributes (see below)
  - Purchase price
  - Current estimated value
  - Condition (Mint, Near Mint, Excellent, Good, Fair, Poor)
  - Date acquired
  - Serial number
  - Certificate/authentication
  - Storage location
  - Notes

**Category-Specific Attributes:**

*Stamps:*
- Country, Year, Condition, Perforated, Gummed, Color, Print run

*Coins:*
- Country, Year, Mint mark, Metal composition, Weight, Diameter, Denomination

*Trading Cards/Pokemon/Magic:*
- Set name, Card number, Rarity, Holo/Variant, Grade, First edition

*Watches:*
- Brand, Model, Movement type, Case material, Band material, Reference number

*Sports Memorabilia:*
- Sport, Team, Player, Game-used, Autographed, Jersey number

**Price Tracking:**
- Manual entry of purchase price
- Current estimated value
- eBay sold listings link (opens in new tab)
- Price history (manual entries)

**Search & Filter:**
- Search by name
- Filter by collection
- Filter by condition
- Sort by value, date added, name

### 4. Share Tab

**Social Features:**
- Share collection summary (link)
- Share individual items
- Community feed preview

**Trading Network:**
- Connect social accounts (placeholder)
- 5% kickback system notice
- Trade request form
- Sell listing creation

**Public Profile Preview:**
- See how your collection appears to others
- Anonymous vs. named display

### 5. Featured Tab (Premium Only)

**Premium Features:**
- More than 2 collections = Premium
- Create personal store/listing
- Featured collections showcase
- Front page placement for active sellers

**Store Features (Premium):**
- Item listings for sale
- Price, shipping info
- Contact seller form

**Community Highlights:**
- Featured collectors
- Trending collections
- New listings

### 6. Export Functionality

- Export all data as JSON
- Export collection as CSV
- Generate PDF report
- Insurance documentation export

---

## Technical Implementation

### Dependencies
- Next.js 16 (App Router)
- Firebase (Auth, Firestore)
- Tailwind CSS
- Lucide React (icons)
- Recharts (charts)
- html2canvas + jspdf (export)

### State Management
- React Context for auth state
- Local state for forms
- Firestore for persistent storage

### Data Models

```
User:
- uid, email, displayName, username
- photoURL, isAnonymous, isPremium
- createdAt, insuranceInfo

Collection:
- id, userId, name, type
- description, coverImage
- itemCount, totalValue
- createdAt, updatedAt

Item:
- id, collectionId, userId
- name, description, photos[]
- categoryAttributes (type-specific)
- purchasePrice, estimatedValue
- condition, dateAcquired
- serialNumber, certificate
- location, notes
- isForSale, salePrice
- createdAt, updatedAt

WishListItem:
- id, userId, name
- priority, estimatedPrice
- notes, createdAt
```

---

## Acceptance Criteria

1. **Authentication:** User can sign in with email/password or Google, and must authenticate before accessing main app
2. **Profile:** User can upload photo, edit username/display name, toggle anonymity, view dashboard stats
3. **Collections:** User can create collections, add items with photos and all attributes, view in grid/list
4. **Premium Logic:** Users with 3+ collections see premium badge and can access featured tab
5. **Export:** User can export data in JSON format
6. **Share:** User can share collections and see social connection options
7. **Wish List:** User can add/remove wish list items
8. **Insurance:** User can store and view insurance information
9. **Responsive:** App works on mobile, tablet, and desktop
10. **Performance:** App loads in under 3 seconds, smooth transitions
