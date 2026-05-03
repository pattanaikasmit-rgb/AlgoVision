import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function DebugTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const addResult = (test: string, passed: boolean, details?: string) => {
    setTestResults(prev => [...prev, `${passed ? '✅' : '❌'} ${test}${details ? ': ' + details : ''}`]);
  };

  useEffect(() => {
    const runTests = async () => {
      try {
        // Test 1: Environment Variables
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        addResult('Gemini API Key exists', !!geminiKey, geminiKey ? `Key found (${geminiKey.substring(0, 10)}...)` : 'Key missing');
        addResult('Raw env check', typeof import.meta.env !== 'undefined', 'import.meta.env available');

        // Test 2: Firebase Config
        const firebaseConfig = {
          apiKey: "AIzaSyCP5xHDImY4oBvVlPISwCwHornGu3piHs4",
          authDomain: "algovision-67d66.firebaseapp.com",
          projectId: "algovision-67d66",
        };
        addResult('Firebase Config', !!firebaseConfig.apiKey, 'Config loaded');

        // Test 3: Firebase Auth
        onAuthStateChanged(auth, (user) => {
          addResult('Firebase Auth initialized', true, user ? 'User logged in' : 'No user');
        });

        // Test 4: Gemini AI
        if (geminiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            addResult('Gemini AI initialized', true, 'AI client created');
          } catch (error) {
            addResult('Gemini AI initialized', false, String(error));
          }
        }

        // Test 5: Browser APIs
        addResult('localStorage available', typeof localStorage !== 'undefined');
        addResult('navigator available', typeof navigator !== 'undefined');

      } catch (error) {
        addResult('Test Suite Error', false, String(error));
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        <p>Running diagnostic tests...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">System Diagnostics</h2>
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}
