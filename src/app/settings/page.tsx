
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


interface NotificationPreferences {
    anomalyAlerts: boolean;
    maintenanceReminders: boolean;
    generalUpdates: boolean;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [engineerType, setEngineerType] = useState('');
  const [notifications, setNotifications] = useState<NotificationPreferences>({
      anomalyAlerts: true,
      maintenanceReminders: true,
      generalUpdates: false,
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);

        const unsubscribeFirestore = onSnapshot(userDocRef, 
          (doc) => {
            setConnectionError(null);
            setIsConnecting(false); 
            if (doc.exists()) {
                const userData = doc.data();
                setDisplayName(userData.displayName || currentUser.displayName || '');
                setEmail(userData.email || currentUser.email || '');
                setEngineerType(userData.engineerType || 'Not specified');
                if (userData.notifications) {
                    setNotifications(userData.notifications);
                }
            } else {
                const initialData = {
                    displayName: currentUser.displayName || '',
                    email: currentUser.email || '',
                    engineerType: 'Not specified',
                    notifications: {
                        anomalyAlerts: true,
                        maintenanceReminders: true,
                        generalUpdates: false,
                    }
                };
                setDoc(userDocRef, initialData).catch(e => console.error("Error creating user doc:", e));
                setDisplayName(initialData.displayName);
                setEmail(initialData.email);
                setEngineerType(initialData.engineerType);
                setNotifications(initialData.notifications);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore connection error:", error);
            setConnectionError("Could not connect to the database. Your data may be outdated.");
            setIsConnecting(false);
            setLoading(false);
            toast({
              variant: 'destructive',
              title: 'Connection Error',
              description: 'Could not fetch your profile data. Please check your connection and try again.',
            });
          }
        );

        return () => unsubscribeFirestore();
      } else {
        // User is logged out
        setUser(null);
        setIsConnecting(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [toast]);

  const handleProfileSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { displayName: displayName });
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update your profile. Please ensure you are online.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (id: keyof NotificationPreferences, value: boolean) => {
      setNotifications(prev => ({...prev, [id]: value}));
  };

  const handleNotificationSave = async () => {
      if (!user) return;
      setSaving(true);
      try {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { notifications });
          toast({
              title: 'Preferences Updated',
              description: 'Your notification settings have been saved.',
          });
      } catch (error) {
          console.error('Error updating notifications:', error);
          toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to save your preferences. Please ensure you are online.',
          });
      } finally {
          setSaving(false);
      }
  };
  
  const PageContent = () => {
    if (isConnecting) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-4">Connecting to database...</p>
        </div>
      );
    }
    
    if (loading) {
       return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-4">Loading your settings...</p>
        </div>
      );
    }

    if (connectionError && !user) {
        return (
             <div className="text-center py-12 border rounded-lg">
                <p className="text-destructive font-semibold">Connection Error</p>
                <p className="text-sm text-muted-foreground">{connectionError}</p>
            </div>
        )
    }

    return (
       <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your name"/>
              </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>
                <div className="space-y-2">
                <Label htmlFor="engineerType">Engineering Discipline</Label>
                <Input id="engineerType" value={engineerType} disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileSave} disabled={saving || loading || !!connectionError} variant="accent">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications from us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="anomaly-alerts">Anomaly Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive an email when the AI detects a critical anomaly in your assets.</p>
                    </div>
                    <Switch id="anomaly-alerts" checked={notifications.anomalyAlerts} onCheckedChange={(val) => handleNotificationChange('anomalyAlerts', val)} />
                </div>
                 <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="maintenance-reminders">Maintenance Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get notified about upcoming scheduled maintenance for your equipment.</p>
                    </div>
                    <Switch id="maintenance-reminders" checked={notifications.maintenanceReminders} onCheckedChange={(val) => handleNotificationChange('maintenanceReminders', val)} />
                </div>
                 <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="general-updates">General Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive news about new features and updates to the PredictAI platform.</p>
                    </div>
                    <Switch id="general-updates" checked={notifications.generalUpdates} onCheckedChange={(val) => handleNotificationChange('generalUpdates', val)} />
                </div>
            </CardContent>
             <CardFooter>
                <Button variant="accent" onClick={handleNotificationSave} disabled={saving || loading || !!connectionError}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Preferences
                </Button>
             </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account">
            <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Manage your account settings, including password changes and account deletion.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Change Password</h3>
                        <div className="space-y-4 max-w-sm">
                             <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" disabled/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" disabled/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" disabled/>
                            </div>
                             <Button variant="outline" disabled>Change Password</Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-destructive mb-2">Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete My Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toast({ title: 'Request noted!', description: 'Account deletion is a manual process for now. We will be in touch.'})}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <h1 className="text-2xl font-bold tracking-tight my-4">Settings</h1>
          <PageContent />
        </main>
      </div>
    </div>
  );
}
