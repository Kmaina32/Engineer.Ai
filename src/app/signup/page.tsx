"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LogoIcon } from '@/components/icons';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [engineerType, setEngineerType] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!engineerType) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Please select your engineering discipline.',
      });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Here you would typically also save the engineerType to your database
      // associated with the new user.
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 text-card-foreground shadow-lg">
        <div className="flex flex-col items-center">
          <LogoIcon className="mb-4 h-10 w-10 text-accent" />
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Join PredictAI to get started</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="engineer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="engineerType">Engineering Discipline</Label>
            <Select onValueChange={setEngineerType} value={engineerType} disabled={loading}>
              <SelectTrigger id="engineerType">
                <SelectValue placeholder="Select your field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mechanical">Mechanical Engineer</SelectItem>
                <SelectItem value="electrical">Electrical Engineer</SelectItem>
                <SelectItem value="civil">Civil Engineer</SelectItem>
                <SelectItem value="chemical">Chemical Engineer</SelectItem>
                <SelectItem value="industrial">Industrial Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading} variant="accent">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
