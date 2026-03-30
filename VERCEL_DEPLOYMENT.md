# Vercel Deployment Guide for Smart Parking Frontend

## Overview
Deploy your HTML/CSS/JS frontend to Vercel with the Render backend at **https://rithik-repo.onrender.com**

---

## Part 1: Prepare Frontend for Vercel

### Step 1: Update API Base URL in All HTML Files

Create/Update API configuration in each HTML file. Replace all fetch calls with your Render backend URL.

**Pattern to use in all HTML files:**
```javascript
// API Configuration
const API_BASE_URL = 'https://rithik-repo.onrender.com';

// Use in all fetch calls:
// OLD: fetch('/api/auth/login', ...)
// NEW: fetch(`${API_BASE_URL}/api/auth/login`, ...)
```

### Step 2: Files to Update

Update these files with the API_BASE_URL configuration:
- `src/main/resources/static/login.html` ✅ (already has example)
- `src/main/resources/static/register.html`
- `src/main/resources/static/dashboard.html`
- `src/main/resources/static/browse-spots.html`
- `src/main/resources/static/my-bookings.html`
- `src/main/resources/static/payment.html`
- `src/main/resources/static/admin-panel.html`
- `src/main/resources/static/index.html`

### Step 3: Test Locally First

```bash
cd c:\Users\saima\smartparking

# Start Spring Boot app on port 8080
./mvnw spring-boot:run

# Or use Docker Compose
docker-compose up -d

# Open browser and test
# http://localhost:8080/login.html
```

Try:
1. Register new account
2. Login
3. Browse parking spots
4. Create reservation

---

## Part 2: Deploy to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click **Sign Up** → Select **GitHub**
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project to Vercel
1. Dashboard → **New Project** or **Add New** → **Import**
2. Select repository: **rithik-repo**
3. Configure project settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `smartparking-frontend` |
| **Framework** | Other (for static HTML) |
| **Root Directory** | `src/main/resources/static` |
| **Build Command** | (Leave empty) |
| **Output Directory** | (Leave empty) |
| **Install Command** | (Leave empty) |

4. Click **Deploy**

### Step 3: Add Environment Variables (Optional)
1. Go to project → **Settings** → **Environment Variables**
2. Add:
```
NAME: VERCEL_ENV
VALUE: production
```

### Step 4: Monitor Deployment
- Vercel auto-deploys when you push to GitHub
- Check **Deployments** tab for status
- Wait ~1-2 minutes for deployment
- Get URL: `https://smartparking-frontend-xyz.vercel.app`

---

## Part 3: Connect Frontend to Render Backend

### Option A: Update All HTML Files (Recommended)

**login.html** - Already has example pattern:
```javascript
const API_BASE_URL = 'https://rithik-repo.onrender.com';

// Then use:
fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})
```

**Apply this pattern to all HTML files.**

### Option B: Update Frontend Files Script

I'll help update all files with the Render URL:

```bash
cd c:\Users\saima\smartparking

# Update all HTML files with Render backend URL
# (This will be done via file edits)
```

### Option C: Create Shared Config File

Create `src/main/resources/static/config.js`:
```javascript
// API Configuration
const CONFIG = {
  API_BASE_URL: 'https://rithik-repo.onrender.com',
  TIMEOUT: 10000,
  DEBUG: false
};

// Export for use in HTML files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
```

Then include in HTML:
```html
<script src="config.js"></script>
<script>
  // Use CONFIG.API_BASE_URL in your code
  fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, ...)
</script>
```

---

## Part 4: Test Deployed Frontend

### Step 1: Test Backend Connection
```
GET https://rithik-repo.onrender.com/api/parking/spots
```
Should return: `[]` or JSON array

### Step 2: Test Frontend
1. Open your Vercel URL: `https://your-frontend.vercel.app`
2. Try user registration:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test@123`
3. Try login with same credentials
4. Check browser console (F12) for errors

### Step 3: Debug CORS Issues
If you see error: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Backend [SecurityConfig.java](../src/main/java/com/parking/smartparking/config/SecurityConfig.java) already has `@CrossOrigin(origins = "*")` on all controllers. Should be fine.

If still issues, add to backend:
```java
@CrossOrigin(origins = {"https://your-frontend.vercel.app", "https://rithik-repo.onrender.com"})
```

---

## Part 5: Update All HTML Files

I'll show the pattern. Add this to **top of `<script>` section** in each HTML file:

### login.html ✅ (Already done)
```javascript
const API_BASE_URL = 'https://rithik-repo.onrender.com';
```

### register.html - Add this pattern
```javascript
const API_BASE_URL = 'https://rithik-repo.onrender.com';

// In form submit handler:
fetch(`${API_BASE_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email, password, phone })
})
```

### dashboard.html - Add this pattern
```javascript
const API_BASE_URL = 'https://rithik-repo.onrender.com';

// In loadDashboard():
fetch(`${API_BASE_URL}/api/parking/spots/available`)
fetch(`${API_BASE_URL}/api/reservations/user/${userId}`)
```

### Other HTML files
Follow same pattern:
```javascript
const API_BASE_URL = 'https://rithik-repo.onrender.com';

// Replace all:
// fetch('/api/...') 
// with:
// fetch(`${API_BASE_URL}/api/...`)
```

---

## Vercel Deployment Checklist

### Before Deploying
- [ ] All HTML files updated with Render backend URL
- [ ] Tested locally on http://localhost:8080
- [ ] Pushed changes to GitHub
- [ ] Vercel account created
- [ ] GitHub integration authorized

### During Deployment
- [ ] Project imported to Vercel
- [ ] Root directory set to `src/main/resources/static`
- [ ] No build command needed
- [ ] Deployment succeeded (check logs)

### After Deployment
- [ ] Test API endpoint from browser console
- [ ] Try registration and login
- [ ] Check browser F12 console for errors
- [ ] Verify data persists (create booking, refresh page)

---

## Quick URLs Reference

| Component | URL |
|-----------|-----|
| **Backend (API)** | https://rithik-repo.onrender.com |
| **Frontend (UI)** | https://your-app.vercel.app |
| **Render Dashboard** | https://dashboard.render.com |
| **Vercel Dashboard** | https://vercel.com/dashboard |

---

## Environment Variables

### Vercel Environment Variables (Optional)
```
REACT_APP_API_URL = https://rithik-repo.onrender.com
REACT_APP_ENV = production
```

### Render Environment Variables (Already Set)
```
SPRING_DATASOURCE_URL = jdbc:h2:mem:parking_db
SPRING_JPA_DATABASE_PLATFORM = org.hibernate.dialect.H2Dialect
```

---

## Troubleshooting Vercel Deployment

### Deployment Failed
1. Check **Deployments** tab → click failed deployment
2. View logs for error messages
3. Common issues:
   - Invalid root directory path
   - Git sync issues (push changes again)
   - Missing files

### Frontend Won't Load
1. Check Vercel URL is accessible
2. Browser console (F12) shows errors?
3. Verify `src/main/resources/static` files exist in GitHub

### API Calls Fail
1. Check `API_BASE_URL` in HTML files
2. Verify backend is running: `https://rithik-repo.onrender.com/api/parking/spots`
3. Check browser console for CORS errors
4. Verify network tab shows requests going to correct URL

### 404 Errors
1. Check file paths in HTML are correct
2. Vercel serves static files from root of specified directory
3. Verify all CSS/JS files are linked correctly

---

## After Full Deployment

### Share Your App
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://rithik-repo.onrender.com`

### Monitor Performance
- **Vercel Analytics**: Dashboard → Analytics
- **Render Metrics**: Dashboard → Metrics
- **Monitor 24/7**: Set up health checks

### Keep Systems Running
- Render free tier: Spins down after 15 min inactivity
  - Upgrade to "Spot" for always-on (~$4/month)
- Vercel always-on on free tier ✓

---

## Example: Complete HTML Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>Smart Parking</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="content"></div>

  <script>
    // ======== API Configuration ========
    const API_BASE_URL = 'https://rithik-repo.onrender.com';
    
    console.log('API Base URL:', API_BASE_URL);
    
    // ======== API Functions ========
    async function registerUser(username, email, password) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Error: ' + error.message);
      }
    }

    async function loginUser(username, password) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
          throw new Error(`Login failed! status: ${response.status}`);
        }
        
        const user = await response.json();
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('username', user.username);
        return user;
      } catch (error) {
        console.error('Login error:', error);
        alert('Error: ' + error.message);
      }
    }

    // ======== Initialize ========
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Page loaded. API ready at:', API_BASE_URL);
    });
  </script>
</body>
</html>
```

---

## Summary

1. ✅ **Backend** deployed on Render: https://rithik-repo.onrender.com
2. 📝 **Update** all HTML files with API_BASE_URL
3. 🚀 **Deploy** frontend files to Vercel
4. 🧪 **Test** registration/login workflow
5. ✨ **Monitor** both services for errors

Your app will be live globally within minutes! 🌍
