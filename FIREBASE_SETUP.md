# Firebase Authentication Setup for Netlify Deployment

## Problem
Account creation/sign-in is not working because Firebase needs to authorize your Netlify domain.

## Solution Steps

### 1. Configure Firebase Authentication Domains

1. **Go to Firebase Console:** https://console.firebase.google.com
2. **Select your project:** `algovision-67d66`
3. **Navigate to:** Authentication → Settings
4. **Under "Authorized domains", add:**
   - `localhost:3000` (for local development)
   - `your-netlify-site-name.netlify.app` (replace with your actual Netlify domain)
   - `*.netlify.app` (wildcard for all Netlify subdomains)

### 2. Enable Google Authentication

1. **Go to:** Authentication → Sign-in method
2. **Click "Google"** and enable it
3. **Configure:**
   - **Email:** Add your support email
   - **Project name:** AlgoVision
   - **Authorized redirect URIs:** Add your Netlify domain
   - **Authorized domains:** Already added in step 1

### 3. Update Environment Variables in Netlify

1. **Go to Netlify:** https://app.netlify.com
2. **Select your site** → Site settings → Build & deploy
3. **Environment variables:**
   ```
   VITE_FIREBASE_API_KEY=AIzaSyCP5xHDImY4oBvVlPISwCwHornGu3piHs4
   VITE_FIREBASE_AUTH_DOMAIN=algovision-67d66.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=algovision-67d66
   VITE_GEMINI_API_KEY=AIzaSyDrYbFe7Bch_lPis7jn0MNU-h1tRmN39gQ
   ```

### 4. Test Authentication

After configuration:
1. **Deploy your site** or test locally
2. **Go to:** `/profile` page
3. **Click "Sign in with Google"**
4. **Complete authentication flow**

## Common Issues & Solutions

### Issue: "The requested action is invalid"
**Solution:** Add your Netlify domain to Firebase authorized domains

### Issue: "API key not authorized"
**Solution:** Ensure correct environment variables in Netlify

### Issue: "Redirect loop"
**Solution:** Check authorized redirect URIs in Firebase

## Verification

Once configured correctly:
- ✅ Users can sign in with Google
- ✅ Account creation works
- ✅ User data is saved to Firestore
- ✅ Authentication persists across sessions

## Support

If you need help:
1. **Firebase Console:** https://console.firebase.google.com
2. **Netlify Docs:** https://docs.netlify.com/edge-functions/trigger-functions/
3. **React Firebase Auth:** https://firebase.google.com/docs/auth/web/start
