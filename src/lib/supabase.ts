import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function showConfigError() {
  // Don’t crash the entire app – show a friendly message and remove spinner
  try {
    const spinner = document.querySelector('.loading-container');
    if (spinner) spinner.remove();

    const root = document.getElementById('root');
    if (root && root.children.length === 0) {
      root.innerHTML = `
        <div style="padding:20px;font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
          <h1 style="margin:0 0 8px;">Configuration error</h1>
          <p style="margin:0 0 12px;">Missing Supabase environment variables.</p>
          <pre style="background:#f8f8f8;padding:12px;border-radius:6px;overflow:auto;">Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY</pre>
          <p style="color:#666;margin-top:12px;">In Vercel → Project Settings → Environment Variables, set these for your Production and Preview environments, then redeploy.</p>
        </div>`;
    }
  } catch (_) {
    // no-op
  }
}

// Minimal safe fallback that won’t crash at import time
function createSupabaseFallback(): any {
  console.error('[Supabase] Not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  if (import.meta.env.PROD) {
    // Surface a helpful UI in production so users aren’t stuck on a spinner
    setTimeout(showConfigError, 0);
  }
  const notConfigured = async () => {
    throw new Error('Supabase is not configured');
  };
  const chain = {
    select: notConfigured,
    insert: notConfigured,
    update: notConfigured,
    delete: notConfigured,
    eq() { return this; },
    order() { return this; },
    limit() { return this; }
  } as any;
  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: new Error('Supabase not configured') };
      },
      onAuthStateChange(_cb: any) {
        return { data: { subscription: { unsubscribe() {} } } } as any;
      },
      signInWithPassword: notConfigured,
      signInWithOAuth: notConfigured,
      signInWithOtp: notConfigured,
      resetPasswordForEmail: notConfigured,
      async signOut() { return { error: null }; }
    },
    from() { return chain; },
    rpc: notConfigured,
    sql: () => null
  } as any;
}

// Lazy initialization to prevent bundling issues
let _supabase: any = null;

function getSupabaseClient() {
  if (_supabase) return _supabase;

  // Check configuration at runtime, not module load time
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const configured = Boolean(url && key);

  _supabase = configured
    ? createClient(url!, key!, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      })
    : createSupabaseFallback();

  // Log initial session on first access only
  if (configured) {
    _supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) {
        console.log('✅ Active Supabase session:', session.user?.email);
      } else {
        console.log('👤 No active session');
      }
    }).catch(() => {
      // ignore
    });
  }

  return _supabase;
}

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    return getSupabaseClient()[prop];
  }
});

export default supabase;
