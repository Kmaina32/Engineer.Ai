
"use client";

import { useEffect, useState } from 'react';
import { SoftwareEngineerDashboard } from '@/components/dashboards/software-engineer-dashboard';
import { MechanicalEngineerDashboard } from '@/components/dashboards/mechanical-engineer-dashboard';
import { DefaultDashboard } from '@/components/dashboards/default-dashboard';
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { LogoIcon } from '../icons';

export default function DashboardPage() {
  const [engineerType, setEngineerType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be fetched from a user profile in a database.
    const storedType = localStorage.getItem('engineerType');
    setEngineerType(storedType);
    setLoading(false);
  }, []);

  const renderDashboard = () => {
    switch (engineerType) {
      case 'software':
        return <SoftwareEngineerDashboard />;
      case 'mechanical':
        return <MechanicalEngineerDashboard />;
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
             <div className="flex items-center justify-center py-20">
               <LogoIcon className="h-10 w-10 animate-pulse text-accent" />
             </div>
            ) : (
              renderDashboard()
            )}
        </main>
      </div>
    </div>
  );
}
