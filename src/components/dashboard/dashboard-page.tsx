
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

import { SoftwareEngineerDashboard } from '@/components/dashboards/software-engineer-dashboard';
import { MechanicalEngineerDashboard } from '@/components/dashboards/mechanical-engineer-dashboard';
import { DefaultDashboard } from '@/components/dashboards/default-dashboard';
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { LogoIcon } from '../icons';

export default function DashboardPage() {
  const [engineerType, setEngineerType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setEngineerType(userDoc.data().engineerType);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          setEngineerType('default');
        }
      } 
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderDashboard = () => {
    switch (engineerType) {
      case 'software':
        return <SoftwareEngineerDashboard />;
      case 'mechanical':
        return <MechanicalEngineerDashboard />;
      case 'civil':
      case 'industrial':
      case 'electrical':
      case 'chemical':
      default:
        return <DefaultDashboard />;
    }
  };

  return (
     <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <LogoIcon className="h-10 w-10 animate-pulse text-accent" />
               <p className="mt-2 text-muted-foreground">Loading Dashboard...</p>
             </div>
            ) : (
              renderDashboard()
            )}
        </main>
      </div>
    </div>
  );
}
