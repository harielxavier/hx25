import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Some features may not work.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

// Set up window.auth compatibility layer for Firebase-like API
if (typeof window !== 'undefined') {
  console.log('🔄 Setting up Supabase window.auth compatibility layer...');
  
  window.auth = {
    currentUser: null,
    
    async signInWithPopup(_auth: any, _provider: any) {
      console.log('🔄 Supabase Google sign-in...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
      // Get the session after OAuth redirect
      const { data: { session } } = await supabase.auth.getSession();
      if (window.auth) window.auth.currentUser = session?.user || null;
      return { user: session?.user || null };
    },
    
    async signInWithEmailAndPassword(_auth: any, email: string, password: string) {
      console.log('🔄 Supabase email sign-in...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (window.auth) window.auth.currentUser = data.user;
      return { user: data.user };
    },
    
    async createUserWithEmailAndPassword(_auth: any, email: string, password: string) {
      console.log('🔄 Supabase user creation...');
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (window.auth) window.auth.currentUser = data.user;
      return { user: data.user };
    },
    
    async signOut() {
      console.log('🔄 Supabase sign-out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (window.auth) window.auth.currentUser = null;
      return true;
    },
    
    onAuthStateChanged(callback: (user: any) => void) {
      console.log('🔄 Supabase auth listener...');
      
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (window.auth) window.auth.currentUser = session?.user || null;
        callback(session?.user || null);
      });
      
      // Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (window.auth) window.auth.currentUser = session?.user || null;
        callback(session?.user || null);
      });
      
      // Return unsubscribe function
      return () => subscription.unsubscribe();
    },
    
    async sendPasswordResetEmail(_auth: any, email: string) {
      console.log('🔄 Supabase password reset...');
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    },
    
    async updatePassword(_user: any, newPassword: string) {
      console.log('🔄 Supabase password update...');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    
    async updateProfile(_user: any, profile: any) {
      console.log('🔄 Supabase profile update...');
      const { error } = await supabase.auth.updateUser(profile);
      if (error) throw error;
    }
  };
  
  // Google Auth Provider compatibility
  window.GoogleAuthProvider = class {
    providerId = 'google.com';
  };
  
  // Initialize session check
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      console.log('✅ Existing Supabase session found:', session.user.email);
      if (window.auth) window.auth.currentUser = session.user;
    }
  });
  
  console.log('✅ Supabase window.auth compatibility layer ready');
}

export default supabase;
