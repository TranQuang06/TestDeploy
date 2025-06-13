# Firebase Permission Fix - Step by Step Guide

## The Problem
You're getting "Missing or insufficient permissions" because Firebase Security Rules are blocking the migration operations.

## Solution Steps

### Step 1: Update Firebase Security Rules (IMMEDIATE FIX)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `superstars-49da9`
3. Go to **Firestore Database** → **Rules** tab
4. Replace the current rules with the temporary rules from `temp-rules.txt`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORARY: Allow all authenticated users to read/write everything
    // This is for migration purposes only
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish** to save the rules

### Step 2: Grant Admin Access to Your Account
1. Go to your website: `/Admin`
2. You'll see the **Admin Setup** tab is now active
3. Click **"Make Me Admin"** button
4. Wait for page to refresh

### Step 3: Run Migration
1. Go to **Migration** tab in Admin panel
2. Click **"Run Migration"** button
3. Migration should now work without permission errors

### Step 4: Restore Secure Rules (IMPORTANT!)
After migration is complete:
1. Go back to Firebase Console → Firestore Database → Rules
2. Replace the temporary rules with the secure rules from `firestore.rules` file
3. This ensures proper security for your production app

## Why This Works
- Temporary rules allow any authenticated user to perform database operations
- This bypasses the permission check during migration
- After migration, secure rules protect your database properly

## Files Created
- `firestore.rules` - Secure production rules (for later)
- `temp-rules.txt` - Temporary permissive rules (for migration)
- `AdminSetup` component - Grants admin access to your account

⚠️ **SECURITY WARNING**: The temporary rules are very permissive. Make sure to restore secure rules after migration!
