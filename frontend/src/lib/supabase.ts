import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

const originalGetSession = supabase.auth.getSession.bind(supabase.auth);
let cachedSessionPromise: Promise<any> | null = null;

supabase.auth.getSession = async () => {
    if (cachedSessionPromise) return cachedSessionPromise;
    
    cachedSessionPromise = originalGetSession().catch(err => {
        cachedSessionPromise = null;
        throw err;
    });

    cachedSessionPromise.finally(() => {
        setTimeout(() => { cachedSessionPromise = null }, 300);
    });

    return cachedSessionPromise;
};

const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
let cachedUserPromise: Promise<any> | null = null;

supabase.auth.getUser = async (jwt?: any) => {
    if (jwt) return originalGetUser(jwt);
    if (cachedUserPromise) return cachedUserPromise;
    
    cachedUserPromise = originalGetUser().catch(err => {
        cachedUserPromise = null;
        throw err;
    });

    cachedUserPromise.finally(() => {
        setTimeout(() => { cachedUserPromise = null }, 300);
    });

    return cachedUserPromise;
};
