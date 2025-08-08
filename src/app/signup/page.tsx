
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
import Image from 'next/image';

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
      // In a real app, this would be saved to a database profile.
      localStorage.setItem('engineerType', engineerType);
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
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <LogoIcon className="h-10 w-10 text-accent mx-auto mb-2" />
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <form onSubmit={handleSignup} className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
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
                  <SelectItem value="software">Software Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" variant="accent" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-accent">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1920x1080.png"
          data-ai-hint="factory blueprint"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
      </div>
    </div>
  );
}
