
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Check } from 'lucide-react';
import { useNotifications } from '@/context/notification-context';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (consent: 'true' | 'false') => {
    localStorage.setItem('cookie_consent', consent);
    setShowBanner(false);

    if (consent === 'true') {
        // Set a cookie that expires in 1 year
        const d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = "predictai_consent=true;" + expires + ";path=/";

         addNotification({
            title: "Cookies Accepted",
            description: "Thank you for accepting our cookie policy.",
            icon: Check
        });
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-secondary/95 backdrop-blur-sm">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-accent" />
            <p className="text-sm text-secondary-foreground">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <Button onClick={() => handleConsent('false')} variant="outline" size="sm">
              Deny
            </Button>
            <Button onClick={() => handleConsent('true')} variant="accent" size="sm">
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
