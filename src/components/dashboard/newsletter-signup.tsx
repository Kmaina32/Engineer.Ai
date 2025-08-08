"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, X } from 'lucide-react';

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterSignup() {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const subscribed = localStorage.getItem('newsletter_subscribed');
    if (subscribed !== 'true') {
      setIsSubscribed(false);
    }
  }, []);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<NewsletterFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('newsletter_subscribed', 'true');
    setIsSubscribed(true);
    setIsSubmitting(false);

    toast({
      title: "Subscription Successful!",
      description: `Thank you for subscribing, ${data.email}!`,
    });
  };

  const handleDismiss = () => {
    localStorage.setItem('newsletter_subscribed', 'true');
    setIsSubscribed(true);
     toast({
      title: "Newsletter Dismissed",
      description: "You won't see this again.",
    });
  }

  if (isSubscribed) {
    return null;
  }

  return (
    <Card className="relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={handleDismiss}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
      </Button>
      <CardHeader>
        <CardTitle>Stay Updated</CardTitle>
        <CardDescription>Subscribe to our newsletter for the latest on new features and updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
          <Input 
            type="email" 
            placeholder="you@company.com" 
            {...form.register('email')}
            disabled={isSubmitting}
            className="flex-grow"
          />
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-2">{form.formState.errors.email.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
