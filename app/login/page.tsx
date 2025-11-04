// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Cookie is now set; middleware will allow /dashboard
        router.replace('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/dr_rajesh-logo.png"
              alt="Caringer AI"
              width={64}
              height={64}
              priority
            />
          </div>
          <div className="text-4xl font-light text-gray-900 mb-2">Sign In</div>
          <div className="text-lg text-gray-400 font-light">
            Doctor Dashboard
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block font-light">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-gray-200 px-0 py-3 text-xl font-light text-gray-900 bg-transparent focus:outline-none focus:border-teal-600 transition-colors placeholder:text-gray-300"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block font-light">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-200 px-0 py-3 text-xl font-light text-gray-900 bg-transparent focus:outline-none focus:border-teal-600 transition-colors placeholder:text-gray-300"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="bg-amber-50 -mx-6 px-6 py-4">
              <p className="text-base font-light text-gray-900">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-teal-600 text-white text-base font-light py-4 hover:bg-teal-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-light text-center">
            By signing in, you agree to our Terms of Use and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}


