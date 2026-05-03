import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AuthDebug() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        setAuthStatus('✅ Authenticated');
        setError('');
      } else {
        setAuthStatus('❌ Not authenticated');
        setError('No user signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  const testGoogleSignIn = async () => {
    try {
      setAuthStatus('🔄 Signing in...');
      setError('');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('Sign in result:', result);
      setAuthStatus('✅ Successfully signed in!');
      setError('');
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthStatus('❌ Sign in failed');
      setError(error.message || 'Unknown error occurred');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Firebase Authentication Debug</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Status: {authStatus}</h3>
          {user && (
            <div className="mt-2 text-sm">
              <p><strong>User ID:</strong> {user.uid}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.displayName}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-800">Error Details:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Test Sign In</h3>
          <button
            onClick={testGoogleSignIn}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Google Sign In
          </button>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Configuration Check</h3>
          <div className="text-sm space-y-1">
            <p><strong>API Key:</strong> {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>Auth Domain:</strong> {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '❌ Missing'}</p>
            <p><strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID || '❌ Missing'}</p>
            <p><strong>Current URL:</strong> {window.location.origin}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
