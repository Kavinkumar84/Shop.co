# 🚨 URGENT: Firebase Security & Vercel Deployment Fix

## ⚠️ **CRITICAL SECURITY ISSUE DETECTED**

Your Firebase API key has been **publicly exposed on GitHub**! This is a serious security risk.

![Security Alert](C:/Users/Admin/.gemini/antigravity/brain/f2bc4fd5-ef05-4d12-975f-fd0c6b6211de/uploaded_image_1768290380082.png)

---

## 🔐 **IMMEDIATE ACTIONS REQUIRED**

### Step 1: Rotate Your Firebase API Key (URGENT)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `shopco84`
3. **Navigate to**: Project Settings → General → Web API Key
4. **Regenerate/Rotate the API key**
5. **Update the key** in your code

> ⚠️ **WARNING**: The exposed key is: `AIzaSyBz3IceaUc9O59Qh2rCHnsm498GdDsB7vA`  
> This key MUST be rotated immediately!

---

### Step 2: Move Firebase Config to Environment Variables

#### 2.1 Create `.env` File

Create a file named `.env` in your project root:

```env
VITE_FIREBASE_API_KEY=your_new_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=shopco84.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shopco84
VITE_FIREBASE_STORAGE_BUCKET=shopco84.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1084634622326
VITE_FIREBASE_APP_ID=1:1084634622326:web:416d3f800d0eb2bf65f257
VITE_FIREBASE_MEASUREMENT_ID=G-GR7W7MCLS2
```

#### 2.2 Update `.gitignore`

Add these lines to `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
.env.development
```

#### 2.3 Update `FirebaseAuth.js`

Replace hardcoded values with environment variables:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

---

### Step 3: Configure Vercel Environment Variables

#### 3.1 Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Add all the variables from your `.env` file:

| Variable Name | Value |
|---------------|-------|
| `VITE_FIREBASE_API_KEY` | `your_new_rotated_key` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `shopco84.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `shopco84` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `shopco84.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1084634622326` |
| `VITE_FIREBASE_APP_ID` | `1:1084634622326:web:416d3f800d0eb2bf65f257` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-GR7W7MCLS2` |

4. **Important**: Make sure all are available for **Production**, **Preview**, and **Development** environments

---

### Step 4: Configure Firebase for Vercel Domain

#### 4.1 Add Authorized Domains in Firebase

1. Go to **Firebase Console** → **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Add your Vercel domain(s):
   - `your-app-name.vercel.app`
   - `your-custom-domain.com` (if you have one)

#### 4.2 Update OAuth Redirect URIs

1. Go to **Google Cloud Console**: https://console.cloud.google.com/
2. Navigate to: **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add **Authorized redirect URIs**:
   - `https://your-app-name.vercel.app`
   - `https://shopco84.firebaseapp.com/__/auth/handler`

---

### Step 5: Remove Exposed Secrets from Git History

#### 5.1 Remove from Current Commit

```bash
# Remove the file with secrets
git rm --cached src/firebase/FirebaseAuth.js

# Create a new version with env variables
# (after updating the file as per Step 2.3)

git add src/firebase/FirebaseAuth.js
git add .env.example
git add .gitignore
git commit -m "Security: Move Firebase config to environment variables"
```

#### 5.2 (Optional) Clean Git History

If you want to completely remove the exposed key from git history:

```bash
# Use git filter-repo (recommended) or BFG Repo-Cleaner
# This is advanced and will rewrite history
```

---

### Step 6: Create `.env.example` for Team

Create `.env.example` with placeholder values:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🔧 **Why Google Auth Wasn't Working on Vercel**

### Root Causes:

1. **Authorized Domains Not Set**
   - Firebase didn't recognize your Vercel domain
   - Solution: Add domain in Firebase Console

2. **Environment Variables Missing**
   - Hardcoded config works locally but Vercel uses build-time env vars
   - Solution: Set env vars in Vercel dashboard

3. **OAuth Redirect Mismatch**
   - Google OAuth redirect URLs didn't include Vercel domain
   - Solution: Update in Google Cloud Console

---

## ✅ **Verification Checklist**

After completing all steps:

- [ ] Rotated Firebase API key in Firebase Console
- [ ] Created `.env` file locally with new credentials
- [ ] Updated `.gitignore` to exclude `.env` files
- [ ] Modified `FirebaseAuth.js` to use environment variables
- [ ] Added environment variables in Vercel dashboard (all 7 variables)
- [ ] Added Vercel domain to Firebase authorized domains
- [ ] Updated OAuth redirect URIs in Google Cloud Console
- [ ] Created `.env.example` for documentation
- [ ] Tested locally with new env variables
- [ ] Committed and pushed changes to GitHub
- [ ] Triggered new Vercel deployment
- [ ] Tested Google Auth on Vercel deployment
- [ ] Closed GitHub security alert

---

## 🚀 **Testing After Fix**

### Local Testing:
```bash
# Make sure .env file exists
npm run dev
# Test Google authentication
```

### Vercel Testing:
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Visit your Vercel URL
4. Test Google Sign In and Sign Up
5. Check browser console for errors

---

## 📝 **Additional Security Best Practices**

1. **Never commit** `.env` files
2. **Always use** environment variables for secrets
3. **Rotate keys** if accidentally exposed
4. **Enable** Firebase App Check for additional security
5. **Set up** Firebase security rules properly
6. **Monitor** Firebase usage for suspicious activity

---

## 🆘 **Still Having Issues?**

### Common Errors:

**Error: "Firebase: Error (auth/unauthorized-domain)"**
- Solution: Add domain to Firebase authorized domains

**Error: "redirect_uri_mismatch"**
- Solution: Update OAuth redirect URIs in Google Cloud Console

**Error: "Firebase config undefined"**
- Solution: Check Vercel environment variables are set correctly

---

## 📚 **Resources**

- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

---

> ⚠️ **REMEMBER**: The old API key `AIzaSyBz3IceaUc9O59Qh2rCHnsm498GdDsB7vA` is compromised and must be rotated immediately!
