import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Camera } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signInWithGoogle, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Sync errors from AuthContext
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      setError(null);
      if (isLogin) {
        await signIn(data.email, data.password);
      } else {
        // For now, we don't support sign up in this form
        setError('Sign up is not available. Please contact the administrator.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (err) {
      // Error is already set in AuthContext and synced via useEffect
      console.error('Google sign-in error in component:', err);
    } finally {
      // Only set loading to false if we're still on this page
      // (redirect auth might navigate away)
      setTimeout(() => {
        setGoogleLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D1E8E2]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-[#A9D6E5]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Camera className="w-8 h-8 text-[#19747E]" />
          <h1 className="text-2xl font-light text-[#19747E]">
            PHOTO<span className="font-bold">CRM</span>
          </h1>
        </div>

        <h2 className="text-xl font-light text-[#19747E] text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 w-full px-4 py-2 bg-[#E2E2E2] border border-[#A9D6E5] rounded-lg
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:border-[#19747E] focus:ring-1 focus:ring-[#19747E]
                       transition-all duration-200"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 w-full px-4 py-2 bg-[#E2E2E2] border border-[#A9D6E5] rounded-lg
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:border-[#19747E] focus:ring-1 focus:ring-[#19747E]
                       transition-all duration-200"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-[#19747E] text-white rounded-lg
                     hover:bg-[#156168] transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg
                     hover:bg-gray-50 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[#19747E] hover:text-[#156168]"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}