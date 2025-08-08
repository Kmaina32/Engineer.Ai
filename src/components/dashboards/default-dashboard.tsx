
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, Wrench, Loader2 } from "lucide-react";
import AssetList from "@/components/dashboard/asset-list";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Asset } from "@/types";

export function DefaultDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const assetsQuery = query(collection(db, "assets"), where("userId", "==", currentUser.uid));
        const unsubscribeFirestore = onSnapshot(assetsQuery, (snapshot) => {
          const userAssets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
          setAssets(userAssets);
          setLoading(false);
        }, () => {
          setLoading(false);
        });
        return () => unsubscribeFirestore();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const activeAlerts = assets.filter(asset => asset.status === 'Critical' || asset.status === 'Warning').length;
  const maintenanceTasks = assets.filter(asset => asset.status === 'Maintenance').length;

  const StatCard = ({ title, value, description, icon: Icon, iconColor }: { title: string, value: number | string, description: string, icon: React.ElementType, iconColor?: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${iconColor}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
            <>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard 
                title="Active Assets"
                value={assets.length}
                description="Currently monitored"
                icon={Activity}
            />
            <StatCard 
                title="Active Alerts"
                value={activeAlerts}
                description="Require attention"
                icon={AlertTriangle}
                iconColor={activeAlerts > 0 ? "text-destructive" : ""}
            />
            <StatCard 
                title="Upcoming Maintenance"
                value={maintenanceTasks}
                description="Assets scheduled for service"
                icon={Wrench}
            />
        </div>

        <div>
            <AssetList />
        </div>
    </div>
  );
}
