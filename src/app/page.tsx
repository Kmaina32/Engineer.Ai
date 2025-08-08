
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/components/dashboard/dashboard-page';
import { LogoIcon } from '@/components/icons';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <LogoIcon className="mb-4 h-12 w-12 animate-pulse text-accent" />
        <p className="text-muted-foreground">Loading Your Dashboard...</p>
      </div>
    );
  }

  if (user) {
    return <DashboardPage />;
  }

  // This will be briefly shown before the redirect kicks in
  return null; 
}
