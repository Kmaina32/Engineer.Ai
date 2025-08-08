

"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

import { SoftwareEngineerDashboard } from '@/components/dashboards/software-engineer-dashboard';
import { MechanicalEngineerDashboard } from '@/components/dashboards/mechanical-engineer-dashboard';
import { ElectricalEngineerDashboard } from '@/components/dashboards/electrical-engineer-dashboard';
import { DefaultDashboard } from '@/components/dashboards/default-dashboard';
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [engineerType, setEngineerType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, 
          (doc) => {
            setConnectionError(null);
            if (doc.exists()) {
              setEngineerType(doc.data().engineerType);
            } else {
              // This might happen if the user document is not created yet
              setEngineerType('default');
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore connection error:", error);
            setConnectionError("Could not connect to the database to retrieve your profile. Some features may be unavailable.");
            setLoading(false);
          }
        );
        return () => unsubscribeFirestore();
    } else {
        // This case should be handled by the root page loader, but as a fallback:
        setLoading(false);
    }
  }, []);

  const renderDashboard = () => {
    if (connectionError) {
        return <DefaultDashboard /> // Show default dashboard which will handle its own error state
    }
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
      <Loader2 className="h-10 w-10 animate-spin text-accent" />
      <p className="mt-2 text-muted-foreground">Loading Your Dashboard...</p>
    </div>
  )

  return (
     <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
           {loading ? <LoadingState /> : renderDashboard()}
        </main>
      </div>
    </div>
  );
}
