'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { collections } = useStore();

  useEffect(() => {
    if (!loading) {
      if (collections.length > 0 || user) {
        router.push('/profile');
      } else {
        router.push('/login');
      }
    }
  }, [loading, user, collections.length, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
      <Loader2 className="animate-spin" size={40} style={{ color: 'var(--color-accent)' }} />
    </div>
  );
}
