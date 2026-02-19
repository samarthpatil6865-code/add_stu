# Class Folio Desk - Netlify Deployment Configuration

## 🌐 Netlify Build Configuration

### **Build Settings**
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18.x`
- **Environment**: Production

### **Environment Variables**
```
NODE_ENV=production
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🔧 Common Netlify Issues & Solutions

### **Issue 1: npm install fails**
**Problem**: Netlify can't install dependencies
**Solution**: 
```bash
# Use npm ci instead of npm install
npm ci --only=production
```

### **Issue 2: Build command not found**
**Problem**: Build script missing
**Solution**: 
```json
{
  "scripts": {
    "build": "vite build",
    "prebuild": "npm ci"
  }
}
```

### **Issue 3: Node version mismatch**
**Problem**: Wrong Node.js version
**Solution**: 
- Set Node version to 18.x in Netlify dashboard
- Or add `.nvmrc` file: `18`

### **Issue 4: Environment variables not available**
**Problem**: API URL not configured
**Solution**: 
- Add environment variables in Netlify dashboard
- Use `VITE_` prefix for frontend variables

## 🚀 Deployment Steps

### **Step 1: Prepare Repository**
```bash
# Ensure package.json has correct scripts
npm run build  # Test locally
```

### **Step 2: Connect to Netlify**
1. Go to [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Configure build settings

### **Step 3: Configure Build**
```
Build command: npm run build
Publish directory: dist
Node version: 18.x
```

### **Step 4: Environment Variables**
```
NODE_ENV=production
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📋 Netlify Configuration Files

### **netlify.toml**
```toml
[build]
  base = "/"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **.nvmrc**
```
18
```

## 🔍 Debugging Netlify Builds

### **Check Build Logs**
1. Go to Netlify dashboard
2. Select your site
3. Click "Deploys" tab
4. Click on failed build to see logs

### **Common Error Messages**
- `"npm ERR! not found"` - Missing dependencies
- `"Command failed with exit code 1"` - Build script error
- `"Cannot find module"` - Missing dependency

## 🚀 Quick Fix Script

Create this `netlify-build.sh`:
```bash
#!/bin/bash
set -e

echo "🚀 Starting Netlify build..."

# Install dependencies
npm ci

# Run linting (optional)
npm run lint || true

# Run tests (optional)
npm run test || true

# Build application
npm run build

echo "✅ Build completed successfully!"
```

## 📱 Production Considerations

### **API Configuration**
```typescript
// In your frontend code
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### **Build Optimization**
```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode analyze"
  }
}
```

### **Error Handling**
```typescript
// Add error boundaries
import { ErrorBoundary } from 'react-error-boundary';
```

## 🔄 Continuous Deployment

Netlify will automatically:
1. **Watch** your GitHub repository
2. **Trigger** builds on push to main branch
3. **Deploy** successful builds to production
4. **Rollback** on failed deployments

## 📞 Support

If you still face issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test build locally
4. Check Node.js version compatibility

---

**Note**: This configuration assumes you're deploying the frontend only. For full-stack deployment, consider using Netlify Functions for the backend.
