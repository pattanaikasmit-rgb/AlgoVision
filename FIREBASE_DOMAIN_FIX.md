# Firebase Domain Authorization Fix for Netlify

## Problem Identified
Account creation works on `localhost:3000` but NOT on `https://algovisio.netlify.app/`

## Root Cause
Firebase doesn't recognize `algovisio.netlify.app` as an authorized domain for authentication.

## Immediate Fix Required

### 1. Go to Firebase Console
**URL:** https://console.firebase.google.com

### 2. Select Your Project
**Project:** `algovision-67d66`

### 3. Configure Authentication Domains
**Navigation:** Authentication → Settings

**Add these domains to "Authorized domains":**
```
localhost:3000
algovisio.netlify.app
*.netlify.app
```

### 4. Configure Google Provider
**Navigation:** Authentication → Sign-in method → Google

**Add to "Authorized redirect URIs":**
```
https://algovisio.netlify.app
https://algovisio.netlify.app/__/auth/handler
https://*.netlify.app
```

### 5. Save Configuration
Click "Save" after adding all domains and URIs.

## Verification Steps

1. **Wait 2-5 minutes** for Firebase changes to propagate
2. **Test authentication** on your deployed site
3. **Check browser console** for any remaining errors

## Alternative Solutions

### Option A: Use Firebase Hosting
Instead of Netlify, deploy to Firebase hosting:
```
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Option B: Use Custom Domain
1. **Buy custom domain** (e.g., algovision.com)
2. **Add custom domain** to both Firebase and Netlify
3. **Update all URLs** to use custom domain

## Expected Result After Fix

✅ **Account creation works** on deployed site
✅ **Google authentication** functions properly
✅ **User data** saves to Firestore
✅ **No "invalid action"** errors

## Technical Details

The error "The requested action is invalid" occurs because:
1. Firebase redirects to authentication handler
2. Handler checks if referring domain is authorized
3. `algovisio.netlify.app` is not in authorized list
4. Firebase rejects the authentication request

## Files Already Updated

- ✅ `src/lib/firebase.ts` - Environment variables configured
- ✅ `src/components/AuthDebug.tsx` - Diagnostic tool created
- ✅ `FIREBASE_SETUP.md` - Setup guide created
- ✅ All changes pushed to GitHub

## Next Action Required

**You must manually add the domain in Firebase Console** - this cannot be automated through code.

Once you add `algovisio.netlify.app` to Firebase authorized domains, account creation will work perfectly.
