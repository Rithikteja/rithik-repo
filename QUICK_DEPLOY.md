# Quick Deployment Steps

## 🚀 Backend Deployment (Render) - 5 minutes

### Step 1: Create Render Account
- Visit https://render.com
- Sign up with GitHub
- Authorize access to your repositories

### Step 2: Create Web Service
1. Dashboard → **New +** → **Web Service**
2. Select **rithik-repo** repository
3. Fill form:
   - **Name**: `smartparking-api`
   - **Environment**: Docker
   - **Build Command**: `./mvnw clean package`
   - **Start Command**: `java -jar target/smartparking-*.jar --server.port=$PORT`
   - **Plan**: Free

### Step 3: Add Secrets
1. Go to service → **Environment**
2. Add these variables:
```
SPRING_DATASOURCE_URL = jdbc:mysql://mysql-1468cc1e-rithik24.i.aivencloud.com:26998/defaultdb?sslMode=REQUIRED
SPRING_DATASOURCE_USERNAME = avnadmin
SPRING_DATASOURCE_PASSWORD = your_aiven_password
SPRING_JPA_DATABASE_PLATFORM = org.hibernate.dialect.MySQLDialect
```

### Step 4: Deploy
- Click **Deploy**
- Wait 2-3 minutes for build
- Get URL: `https://smartparking-api.onrender.com` ✅

---

## 🌐 Frontend Deployment (Vercel) - 5 minutes

### Step 1: Create Vercel Account
- Visit https://vercel.com
- Sign up with GitHub
- Authorize access

### Step 2: Import Project
1. Dashboard → **Add New** → **Project**
2. Select **rithik-repo**
3. Configure:
   - **Framework**: Other (static)
   - **Root Directory**: `src/main/resources/static`
   - Leave others default

### Step 3: Add Environment Variables
1. Settings → **Environment Variables**
2. Add:
```
REACT_APP_API_URL = https://smartparking-api.onrender.com
```

### Step 4: Deploy
- Click **Deploy**
- Wait 30 seconds
- Get URL: `https://your-app.vercel.app` ✅

---

## 🔗 Connect Frontend to Backend

### Update API Endpoints in Frontend

Edit each HTML file and replace:
```javascript
// OLD
fetch('/api/auth/login', ...)

// NEW
const API = 'https://smartparking-api.onrender.com';
fetch(`${API}/api/auth/login`, ...)
```

**Files to update:**
- [login.html](src/main/resources/static/login.html)
- [register.html](src/main/resources/static/register.html)
- [dashboard.html](src/main/resources/static/dashboard.html)
- [browse-spots.html](src/main/resources/static/browse-spots.html)
- [my-bookings.html](src/main/resources/static/my-bookings.html)
- [payment.html](src/main/resources/static/payment.html)
- [admin-panel.html](src/main/resources/static/admin-panel.html)

**Or use script:**
```bash
cd c:\Users\saima\smartparking
update-api-url.bat https://smartparking-api.onrender.com
```

---

## ✅ Test Deployment

### Backend Test
```
GET https://smartparking-api.onrender.com/api/parking/spots
```
Should return: `[]` or JSON array

### Frontend Test
1. Open `https://your-app.vercel.app`
2. Try register → login → dashboard
3. Check console (F12) for errors

---

## 📝 Sample API Base Setup (Add to all HTML files)

```html
<script>
// Configuration
const API_BASE_URL = 'https://smartparking-api.onrender.com';

// Use in all fetch calls
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user = await response.json();
    sessionStorage.setItem('userId', user.id);
    sessionStorage.setItem('username', user.username);
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed: ' + error.message);
  }
}
</script>
```

---

## 🐛 Troubleshooting

### Backend won't deploy
- Check Render logs → Deployments → Build logs
- Verify `pom.xml` exists in root
- Ensure MySQL connection string is correct

### Frontend shows errors
- Open browser console (F12)
- Check "Network" tab for failed requests
- Verify `API_BASE_URL` matches your Render URL
- Check CORS: Backend needs `@CrossOrigin` annotation

### Data not saving
- Verify MySQL connection on Render
- Check `SPRING_DATASOURCE_PASSWORD` is set
- Test endpoint in Postman: `GET https://your-api.onrender.com/api/parking/spots`

### Domain issues
- Wait 5-10 minutes for DNS propagation
- Hard refresh browser (Ctrl+Shift+R)
- Check Vercel/Render URL in settings

---

## 💾 Environment Variables Reference

**Render (Backend)**
```
SPRING_DATASOURCE_URL=jdbc:mysql://...
SPRING_DATASOURCE_USERNAME=avnadmin
SPRING_DATASOURCE_PASSWORD=***
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

**Vercel (Frontend)**
```
REACT_APP_API_URL=https://smartparking-api.onrender.com
```

---

## 🎉 Final URLs

After deployment, you'll have:
- **Backend**: `https://smartparking-api.onrender.com`
- **Frontend**: `https://your-app.vercel.app`

Visit the frontend URL in browser to use the app!

---

## 📚 Full Documentation
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed information.
