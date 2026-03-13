"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

/**
 * /auth/callback
 * This page handles the redirect after:
 *  - Google OAuth login
 *  - Email confirmation (magic link / signup verify)
 * Supabase automatically exchanges the code in the URL for a session.
 * We just wait and redirect accordingly.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // The URL contains a code param that Supabase SSR client exchanges for a session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        router.push('/login?message=Authentication failed. Please try again.');
        return;
      }

      if (session) {
        router.push('/dashboard');
      } else {
        // Wait briefly for the session to be established from the URL hash
        setTimeout(async () => {
          const { data: { session: laterSession } } = await supabase.auth.getSession();
          if (laterSession) {
            router.push('/dashboard');
          } else {
            router.push('/login?message=Session could not be established. Please log in.');
          }
        }, 1500);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Authenticating...</p>
    </div>
  );
}
