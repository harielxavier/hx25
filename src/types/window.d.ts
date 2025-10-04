// Type definitions for window extensions
export {};

declare global {
  interface Window {
    auth?: {
      currentUser: any;
      signInWithPopup: (auth: any, provider: any) => Promise<{ user: any }>;
      signInWithEmailAndPassword: (auth: any, email: string, password: string) => Promise<{ user: any }>;
      createUserWithEmailAndPassword: (auth: any, email: string, password: string) => Promise<{ user: any }>;
      signOut: () => Promise<boolean>;
      onAuthStateChanged: (callback: (user: any) => void) => () => void;
      sendPasswordResetEmail: (auth: any, email: string) => Promise<void>;
      updatePassword: (user: any, newPassword: string) => Promise<void>;
      updateProfile: (user: any, profile: any) => Promise<void>;
    };
    GoogleAuthProvider?: any;
    Clerk?: any;
    ClerkProvider?: any;
    useClerk?: any;
    useUser?: any;
    useAuth?: any;
  }
}
