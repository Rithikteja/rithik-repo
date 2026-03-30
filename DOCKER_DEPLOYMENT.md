# Docker Deployment Guide for Render

## Overview
This guide covers:
1. Building Docker image locally
2. Testing with Docker & Docker Compose
3. Deploying to Render using Docker

---

## Prerequisites
- Docker installed (https://www.docker.com/products/docker-desktop)
- Docker Compose (usually comes with Docker Desktop)
- GitHub repository with Dockerfile

---

## Part 1: Docker Setup (Local Testing)

### Step 1: Build Docker Image Locally
```bash
cd c:\Users\saima\smartparking

# Build the image with tag
docker build -t smartparking:latest .

# Or with more details
docker build -t smartparking:1.0 --no-cache .
```

### Step 2: Run Container with H2 Database (Development)
```bash
docker run -d \
  --name smartparking-dev \
  -p 8080:8080 \
  -e PORT=8080 \
  -e SPRING_DATASOURCE_URL=jdbc:h2:mem:parking_db \
  -e SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.h2.Driver \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  smartparking:latest

# Check logs
docker logs -f smartparking-dev

# Test API
curl http://localhost:8080/api/parking/spots

# Stop container
docker stop smartparking-dev
docker rm smartparking-dev
```

### Step 3: Use Docker Compose (Easier)
```bash
# Run with H2 (development)
docker-compose up -d

# Check logs
docker-compose logs -f app

# Test API
curl http://localhost:8080/api/parking/spots

# Stop and remove
docker-compose down
```

### Step 4: Run with MySQL in Docker Compose
Create `.env` file in project root:
```
MYSQL_PASSWORD=your_secure_password_here
```

Uncomment MySQL section in [docker-compose.yml](docker-compose.yml):
```bash
docker-compose up -d

# Wait for both services to start
docker-compose ps

# Test
curl http://localhost:8080/api/parking/spots
```

---

## Part 2: Deploy to Render with Docker

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create Web Service with Docker
1. Dashboard → **New +** → **Web Service**
2. Select your **rithik-repo** GitHub repository
3. Fill form:

| Field | Value |
|-------|-------|
| **Name** | `smartparking-api` |
| **Environment** | Docker |
| **Region** | Choose nearest (auto-detected) |
| **Branch** | `master` |
| **Build Command** | (Leave empty - Docker will use FROM maven) |
| **Start Command** | (Leave empty - Docker CMD handles this) |
| **Plan** | Free |

### Step 3: Add Environment Variables
In Render dashboard, click service → **Environment** tab:

**For Development (with H2):**
```
SPRING_DATASOURCE_URL = jdbc:h2:mem:parking_db
SPRING_DATASOURCE_DRIVER_CLASS_NAME = org.h2.Driver
SPRING_JPA_DATABASE_PLATFORM = org.hibernate.dialect.H2Dialect
```

**For Production (with MySQL):**
```
SPRING_DATASOURCE_URL = jdbc:mysql://mysql-1468cc1e-rithik24.i.aivencloud.com:26998/defaultdb?sslMode=REQUIRED
SPRING_DATASOURCE_USERNAME = avnadmin
SPRING_DATASOURCE_PASSWORD = your_aiven_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME = com.mysql.cj.jdbc.Driver
SPRING_JPA_DATABASE_PLATFORM = org.hibernate.dialect.MySQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO = update
```

### Step 4: Deploy
1. Click **Deploy** or wait for auto-deployment on git push
2. Monitor logs: **Deployments** → **Build & Deploy logs**
3. Wait 3-5 minutes for first build
4. Get URL: `https://smartparking-api.onrender.com`

---

## Docker Files Explained

### Dockerfile
- **Stage 1**: Maven builder - compiles Java code into JAR
- **Stage 2**: JRE runtime - minimal image (~200MB) with only runtime
- **Health check**: Verifies app is running
- **Non-root user**: Security best practice
- **Dynamic PORT**: Uses `${PORT}` env variable from Render

### .dockerignore
Excludes unnecessary files to speed up build:
- Maven build files (`target/`, `.mvn/`)
- Git files
- IDE files
- Documentation

### docker-compose.yml
- **Development**: H2 in-memory database (no external DB needed)
- **Production**: Optional MySQL (uncommented for testing)
- **Health checks**: Auto-restart on failure
- **Port mapping**: 8080:8080

---

## Troubleshooting Docker

### Image Build Fails
```bash
# Clear Docker cache and rebuild
docker build -t smartparking:latest --no-cache .

# Check Dockerfile syntax
docker build --help | grep -i "invalid"

# Verbose output
docker build -t smartparking:latest --verbose .
```

### Container Won't Start
```bash
# View build errors
docker logs smartparking-dev

# Check if port is in use
netstat -ano | findstr :8080
# Kill process: taskkill /PID <PID> /F

# Run with interactive shell for debugging
docker run -it smartparking:latest /bin/sh
```

### Render Deployment Fails
1. Go to **Deployments** tab
2. Click failing deployment → **View logs**
3. Common issues:
   - `Out of memory`: Switch to paid plan
   - `Build timeout`: Check Dockerfile for long processes
   - `Port binding error`: Verify PORT env var is set

### Test Container Health
```bash
# SSH into container (Render dashboard)
# Or locally:
docker exec -it smartparking-dev /bin/sh

# Check if app is running
curl http://localhost:8080/api/parking/spots

# View detailed logs
docker logs smartparking-dev --tail 100
```

---

## Image Size Optimization

### Current Build
- **Stage 1 (builder)**: ~500MB (Maven + JDK) - discarded after build
- **Stage 2 (runtime)**: ~170MB (JRE + JAR) - deployed

### Reduce Size Further
Add to Dockerfile Stage 2:
```dockerfile
# Remove unnecessary files
RUN rm -rf /app/app.jar.* && \
    apk del --no-cache git
```

---

## Performance Tips

### Build Speed
- Use `.dockerignore` (included ✓)
- Use multi-stage build (included ✓)
- Cache Maven plugins: Already done ✓

### Runtime Speed
- Alpine JRE is ~170MB (included ✓)
- Non-root user (included ✓)
- Health checks prevent restart loops (included ✓)

### Monitoring
In Render dashboard:
- **Metrics** tab: CPU, RAM usage
- **Logs** tab: Real-time application logs
- **Health** tab: Uptime status

---

## Deployment Checklist

- [ ] Dockerfile exists in repository root
- [ ] .dockerignore file created
- [ ] docker-compose.yml for local testing
- [ ] GitHub repo is public
- [ ] Pushed all files to GitHub
- [ ] Render account created
- [ ] New Web Service created with Docker environment
- [ ] Environment variables set on Render
- [ ] First deployment successful (check logs)
- [ ] API endpoint responds: `https://smartparking-api.onrender.com/api/parking/spots`

---

## Quick Commands Reference

```bash
# Build Docker image
docker build -t smartparking:latest .

# Run container locally
docker run -d -p 8080:8080 --name smartparking smartparking:latest

# Use Docker Compose
docker-compose up -d

# Check logs
docker logs smartparking
docker-compose logs -f app

# Stop and clean
docker stop smartparking
docker-compose down

# Test API
curl http://localhost:8080/api/parking/spots
```

---

## After Deployment

1. **Test Backend**: `https://smartparking-api.onrender.com/api/parking/spots`
2. **Deploy Frontend** to Vercel
3. **Update frontend** with API URL: `https://smartparking-api.onrender.com`
4. **Monitor** Render dashboard for errors

See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for full setup.
