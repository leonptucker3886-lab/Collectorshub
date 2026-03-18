'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, FolderOpen, Share2, Star, Settings, Shield } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

export default function Navigation() {
  const pathname = usePathname();
  const { isPremium } = useStore();

  const tabs = [
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/collections', icon: FolderOpen, label: 'Collections' },
    { href: '/share', icon: Share2, label: 'Share' },
    { href: '/featured', icon: Star, label: 'Featured', premium: true },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="tab-bar">
      {tabs.map(tab => {
        const isActive = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        
        if (tab.premium && !isPremium()) {
          return (
            <Link 
              key={tab.href} 
              href="/featured" 
              className={`tab-item ${isActive ? 'active' : ''}`}
              style={{ opacity: 0.5 }}
            >
              <Icon />
              <span>{tab.label}</span>
              <Shield size={10} className="text-warning" style={{ position: 'absolute', top: 4, right: '20%' }} />
            </Link>
          );
        }

        return (
          <Link 
            key={tab.href} 
            href={tab.href} 
            className={`tab-item ${isActive ? 'active' : ''}`}
          >
            <Icon />
            <span>{tab.label}</span>
            {tab.premium && isPremium() && (
              <span className="badge badge-premium" style={{ fontSize: '8px', padding: '2px 6px', position: 'absolute', top: 2, right: '15%' }}>PRO</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
