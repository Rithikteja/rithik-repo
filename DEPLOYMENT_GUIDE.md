# Deployment Guide: Render + Vercel

## Part 1: Deploy Backend on Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account (recommended)
3. Authorize Render to access your repositories

### Step 2: Prepare Backend Configuration
1. Create `.env.render` file in project root with:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/your-db?sslMode=REQUIRED
   SPRING_DATASOURCE_USERNAME=your-username
   SPRING_DATASOURCE_PASSWORD=your-password
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```

2. Update [application.properties](src/main/resources/application.properties) to use environment variables (already done ✅)

### Step 3: Create Render Web Service
1. Log in to Render Dashboard
2. Click **New +** → **Web Service**
3. Connect your GitHub repository (Rithikteja/rithik-repo)
4. Fill in the form:
   - **Name**: smartparking-api (or your choice)
   - **Environment**: Docker
   - **Branch**: master
   - **Build Command**: `./mvnw clean package`
   - **Start Command**: `java -jar target/smartparking-*.jar --server.port=$PORT`

5. Select plan (Free tier available)

### Step 4: Add Environment Variables on Render
1. In Render dashboard, go to your service
2. Click **Environment**
3. Add these variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://...
   SPRING_DATASOURCE_USERNAME=avnadmin
   SPRING_DATASOURCE_PASSWORD=your_password
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect
   ```

4. Click **Save**

### Step 5: Deploy
- Render auto-deploys when you push to GitHub
- Monitor build logs in dashboard
- Once complete, you'll get a URL like: `https://smartparking-api.onrender.com`

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Extract Frontend Files
1. Create a new GitHub repository for frontend (or folder in existing repo)
2. Copy these files:
   ```
   src/main/resources/static/
   ├── index.html
   ├── login.html
   ├── register.html
   ├── dashboard.html
   ├── browse-spots.html
   ├── my-bookings.html
   ├── payment.html
   ├── admin-panel.html
   └── styles.css
   ```

**Option A: Separate Frontend Repo** (Recommended)
```bash
mkdir smartparking-frontend
cd smartparking-frontend
git init
# Add the static files above
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/Rithikteja/smartparking-frontend.git
git push -u origin main
```

**Option B: Deploy from existing repo**
- Create `frontend` folder in your repo containing the static files

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 3: Update Frontend API Endpoints
Edit your frontend files to use the Render backend URL:

In **html files**, replace API calls:
```javascript
// OLD: const response = await fetch('/api/auth/login', ...)
// NEW:
const API_BASE = 'https://smartparking-api.onrender.com';
const response = await fetch(`${API_BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
```

Create a `config.js` in your static folder:
```javascript
// config.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export default API_BASE;
```

Then import in your HTML files or update all fetch URLs.

### Step 4: Deploy to Vercel
1. Log in to Vercel Dashboard
2. Click **New Project** or **Add New** → **Project**
3. Select your frontend repository
4. Configure:
   - **Framework**: Other (for static HTML/CSS/JS)
   - **Root Directory**: `src/main/resources/static` (or `frontend`)
   - **Output Directory**: `.` (root)

5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://smartparking-api.onrender.com
   ```

6. Click **Deploy**

---

## Part 3: Connect Frontend to Backend

### Option 1: Update HTML files with API base URL
Add this to the top of each HTML file:
```html
<script>
  const API_BASE = 'https://smartparking-api.onrender.com';
  
  // Then use in fetch calls:
  // fetch(`${API_BASE}/api/auth/login`, ...)
</script>
```

### Option 2: Use CORS Proxy (if needed)
If you get CORS errors, add to backend [SecurityConfig.java](src/main/java/com/parking/smartparking/config/SecurityConfig.java):
```java
@CrossOrigin(origins = "https://your-vercel-domain.vercel.app")
```

---

## Full Deployment Checklist

### Backend (Render)
- [ ] GitHub repo is public
- [ ] `pom.xml` is at repository root
- [ ] Environment variables set on Render
- [ ] MySQL database connection works
- [ ] Build command: `./mvnw clean package`
- [ ] Start command includes `--server.port=$PORT`

### Frontend (Vercel)
- [ ] Static files in correct directory
- [ ] API endpoints updated to use Render backend URL
- [ ] CORS enabled on backend for Vercel domain
- [ ] Environment variables configured
- [ ] Test login/register through web UI

---

## Verification Steps

### Test Backend
1. Open: `https://smartparking-api.onrender.com/api/parking/spots`
2. Should return JSON array (or empty if no data)

### Test Frontend
1. Open: `https://your-app.vercel.app`
2. Try register → login → dashboard
3. Check browser console for errors (F12)

### Debug Issues
- **Backend**: Check Render logs → Deployments → Build & Deploy logs
- **Frontend**: Check Vercel logs → Deployments → View logs
- **CORS errors**: Verify `@CrossOrigin` annotation in backend controllers
- **API calls fail**: Verify backend URL in frontend code matches deployed URL

---

## Optional: Use Custom Domain

### Render
1. Domain settings → Add custom domain
2. Add DNS records as shown
3. SSL certificate auto-generated

### Vercel
1. Settings → Domains
2. Add your domain
3. Follow DNS configuration

---

## Example: Complete Setup with Environment

### Backend (.env on Render)
```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-1468cc1e-rithik24.i.aivencloud.com:26998/defaultdb?sslMode=REQUIRED
SPRING_DATASOURCE_USERNAME=avnadmin
SPRING_DATASOURCE_PASSWORD=your_aiven_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### Frontend (Vercel Environment)
```
REACT_APP_API_URL=https://smartparking-api.onrender.com
```

### HTML Example
```html
<script>
const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

async function login() {
  const response = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user', password: 'pass' })
  });
  const data = await response.json();
  sessionStorage.setItem('userId', data.id);
}
</script>
```

---

## Summary

| Component | Platform | Benefits |
|-----------|----------|----------|
| Spring Boot Backend | Render | Free tier, auto-deploy, Java support, built-in monitoring |
| Static Frontend | Vercel | Free tier, CDN, instant deploy, serverless functions |
| Database | Aiven MySQL | Managed, SSL enabled, paid tier required |

**Estimated Cost**: Free (trial) to ~$15/month for production

