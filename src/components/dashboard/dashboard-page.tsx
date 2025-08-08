
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

import { SoftwareEngineerDashboard } from '@/components/dashboards/software-engineer-dashboard';
import { MechanicalEngineerDashboard } from '@/components/dashboards/mechanical-engineer-dashboard';
import { ElectricalEngineerDashboard } from '@/components/dashboards/electrical-engineer-dashboard';
import { DefaultDashboard } from '@/components/dashboards/default-dashboard';
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { LogoIcon } from '../icons';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [engineerType, setEngineerType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);

        const unsubscribeFirestore = onSnapshot(userDocRef, 
          (doc) => {
            setIsConnecting(false); // Connected!
            if (doc.exists()) {
              setEngineerType(doc.data().engineerType);
            } else {
              setEngineerType('default'); // Fallback for existing users with no type
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore connection error:", error);
            setIsConnecting(false); // Stop showing connecting on error
            setLoading(false);
          }
        );
        return () => unsubscribeFirestore();
      } else {
        router.push('/login');
        setIsConnecting(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const renderDashboard = () => {
    switch (engineerType) {
      case 'software':
        return <SoftwareEngineerDashboard />;
      case 'mechanical':
        return <MechanicalEngineerDashboard />;
      case 'electrical':
        return <ElectricalEngineerDashboard />;
      case 'civil':
      case 'industrial':
      case 'chemical':
      default:
        return <DefaultDashboard />;
    }
  };
  
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <LogoIcon className="h-10 w-10 animate-pulse text-accent" />
      <p className="mt-2 text-muted-foreground">Loading Dashboard...</p>
    </div>
  )

  const ConnectingState = () => (
     <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="mt-4 text-muted-foreground">Connecting to database...</p>
    </div>
  )


  return (
     <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
           {isConnecting ? <ConnectingState /> : loading ? <LoadingState /> : renderDashboard()}
        </main>
      </div>
    </div>
  );
}
