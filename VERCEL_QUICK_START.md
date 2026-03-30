# Vercel Deployment - Quick Start (5 minutes)

## Backend Already Deployed ✅
**URL**: https://rithik-repo.onrender.com  
**Status**: Running on Render with Docker

---

## Step 1: Update Frontend Files
All HTML files now have `API_BASE_URL` configuration:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080'
  : 'https://rithik-repo.onrender.com';
```

**Updated files:**
- ✅ login.html
- ✅ register.html
- ✅ dashboard.html

**Still need updates** (same pattern):
- browse-spots.html
- my-bookings.html
- payment.html
- admin-panel.html
- index.html

---

## Step 2: Deploy to Vercel (3 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **New Project** → Select **rithik-repo**
4. Configure:
   - **Root Directory**: `src/main/resources/static`
   - Leave other fields default
5. Click **Deploy**
6. Wait 1-2 minutes
7. Get URL like: `https://smartparking-xyz.vercel.app`

---

## Step 3: Test (2 minutes)

```
Frontend: https://your-app.vercel.app
Backend:  https://rithik-repo.onrender.com
```

Try:
1. Register: testuser / test@test.com / Test@123
2. Login with same credentials
3. Browse parking spots
4. Create reservation

---

## Environment Variables (Already Set)

| Component | URL |
|-----------|-----|
| Backend | https://rithik-repo.onrender.com |
| Frontend | https://your-app.vercel.app |

---

## If You Get CORS Error

Backend already has `@CrossOrigin(origins = "*")` - should work!

If not, contact backend team to whitelist Vercel domain in SecurityConfig.

---

## Next Steps

1. ✅ Push changes to GitHub
2. ✅ Deploy to Vercel
3. ✅ Test registration/login
4. ✅ Share URL with users!

---

## Files Location

- **Production**: https://github.com/Rithikteja/rithik-repo
- **Branch**: master
