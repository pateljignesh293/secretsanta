# 🚀 Deployment Guide - Secret Santa Application

## Overview

This guide covers deploying your Secret Santa application to production using popular hosting services.

---

## 🗂️ Pre-Deployment Checklist

### Backend
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set up email service (Gmail/SendGrid)
- [ ] Test all API endpoints
- [ ] Review error handling

### Frontend
- [ ] Update `VITE_API_URL` to production API
- [ ] Test production build locally
- [ ] Check all images load
- [ ] Verify all routes work
- [ ] Test on different devices

### Database
- [ ] Backup local data if needed
- [ ] Set up MongoDB Atlas account
- [ ] Create production database

---

## 📊 Deployment Options

### Recommended Stack
```
Backend:   Railway / Render / Heroku
Frontend:  Vercel / Netlify
Database:  MongoDB Atlas
Email:     SendGrid / Gmail
Files:     Cloudinary (optional)
```

---

## 🎯 Option 1: Railway (Backend)

### Why Railway?
- Free tier available
- Easy MongoDB connection
- Automatic deployments
- Environment variables management

### Steps

#### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

#### 2. Create New Project
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Or use web interface
```

#### 3. Deploy Backend
```bash
# From project root
railway login
railway init
railway up
```

#### 4. Add Environment Variables
In Railway dashboard, add:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/secretsanta
JWT_SECRET=your-super-secure-random-string-here
FRONTEND_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
REVEAL_DATE=2025-12-25T00:00:00Z
MAX_PARTICIPANTS=30
```

#### 5. Deploy
```bash
railway up
```

Your backend will be available at: `https://your-app.up.railway.app`

---

## 🎯 Option 2: Render (Backend)

### Steps

#### 1. Create Account
- Go to https://render.com
- Sign up with GitHub

#### 2. New Web Service
- Click "New +" → "Web Service"
- Connect your repository
- Or use manual deployment

#### 3. Configure
```yaml
Name: secret-santa-api
Environment: Node
Build Command: npm install
Start Command: node server/server.js
```

#### 4. Environment Variables
Add same variables as Railway above

#### 5. Deploy
- Click "Create Web Service"
- Wait for build to complete

URL: `https://your-app.onrender.com`

---

## 🗄️ MongoDB Atlas Setup

### Steps

#### 1. Create Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up (free tier available)

#### 2. Create Cluster
- Choose free tier (M0)
- Select region closest to your users
- Create cluster (takes 3-5 minutes)

#### 3. Create Database User
- Database Access → Add New User
- Username: `secretsanta`
- Password: (generate strong password)
- Database User Privileges: Read & Write

#### 4. Whitelist IP
- Network Access → Add IP Address
- Allow Access from Anywhere: `0.0.0.0/0`
- (Or specific Railway/Render IPs)

#### 5. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy connection string:
```
mongodb+srv://secretsanta:<password>@cluster0.xxxxx.mongodb.net/secretsanta?retryWrites=true&w=majority
```

#### 6. Add to Environment
Update `MONGODB_URI` in your hosting platform

---

## 🌐 Frontend Deployment (Vercel)

### Why Vercel?
- Free tier
- Automatic GitHub deployments
- Global CDN
- Easy environment variables

### Steps

#### 1. Prepare Frontend
```bash
cd client

# Create production build
npm run build

# Test build locally
npm run preview
```

#### 2. Sign Up
- Go to https://vercel.com
- Sign up with GitHub

#### 3. Import Project
- Click "Add New" → "Project"
- Import your repository
- Select `client` folder as root directory

#### 4. Configure Build
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 5. Environment Variables
Add in Vercel dashboard:
```
VITE_API_URL=https://your-backend.railway.app/api
```

#### 6. Deploy
- Click "Deploy"
- Wait for build (2-3 minutes)

URL: `https://your-app.vercel.app`

---

## 🌐 Option: Netlify (Frontend)

### Steps

#### 1. Sign Up
- Go to https://netlify.com
- Sign up with GitHub

#### 2. New Site
- Connect repository
- Or drag & drop `client/dist` folder

#### 3. Build Settings
```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

#### 4. Environment Variables
```
VITE_API_URL=https://your-backend.railway.app/api
```

#### 5. Deploy
- Click "Deploy site"

URL: `https://your-app.netlify.app`

---

## 📧 Email Service Setup

### Option 1: SendGrid

#### 1. Create Account
- Go to https://sendgrid.com
- Free tier: 100 emails/day

#### 2. Create API Key
- Settings → API Keys
- Create API Key
- Copy key

#### 3. Update Environment
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key-here
EMAIL_FROM=Secret Santa <noreply@yourdomain.com>
```

### Option 2: Gmail (Small Scale)

#### 1. Enable 2FA
- Google Account → Security
- Turn on 2-Step Verification

#### 2. App Password
- Security → App Passwords
- Select "Mail" and your device
- Generate password

#### 3. Update Environment
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

---

## 🖼️ Image Storage (Optional: Cloudinary)

### Setup

#### 1. Create Account
- Go to https://cloudinary.com
- Free tier available

#### 2. Get Credentials
- Dashboard → Account Details
- Cloud name
- API Key
- API Secret

#### 3. Update .env
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 4. Update Code
In `server/routes/gifts.js`, switch from local to Cloudinary upload.

---

## 🔒 Security Checklist

### Production Security

```
✅ Strong JWT_SECRET (32+ random characters)
✅ HTTPS enabled (automatic on Vercel/Netlify)
✅ MongoDB IP whitelist configured
✅ Email credentials secure
✅ Rate limiting enabled
✅ CORS configured correctly
✅ Input validation active
✅ Error messages generic (no stack traces)
```

### Generate Secure JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use: https://randomkeygen.com/
```

---

## 📊 Post-Deployment Testing

### Backend Tests
```bash
# Health check
curl https://your-backend.railway.app/api/health

# Test auth
curl -X POST https://your-backend.railway.app/api/auth/simulate-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.johnson@company.com","otp":"1234"}'
```

### Frontend Tests
- [ ] Open homepage
- [ ] Login flow
- [ ] View assignment
- [ ] Upload gift
- [ ] Reveal page
- [ ] Admin dashboard
- [ ] Dark mode toggle
- [ ] Mobile responsiveness

---

## 🎯 Custom Domain (Optional)

### Vercel
1. Settings → Domains
2. Add your domain
3. Update DNS records
4. Wait for verification

### Netlify
1. Domain Settings → Add custom domain
2. Update DNS
3. Enable HTTPS

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

```
1. Push to GitHub main branch
   ↓
2. Hosting platform detects change
   ↓
3. Automatic build & deploy
   ↓
4. New version live in 2-3 minutes
```

### Manual Deployments
```bash
# Railway
railway up

# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

## 📈 Monitoring

### Backend
- Railway Dashboard → Metrics
- Render Dashboard → Logs
- MongoDB Atlas → Metrics

### Frontend
- Vercel Dashboard → Analytics
- Netlify Analytics

### Recommended Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User analytics

---

## 🐛 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS Errors
Check `.env`:
```
FRONTEND_URL=https://your-exact-frontend-url.vercel.app
```

#### Database Connection
- Verify MongoDB URI is correct
- Check IP whitelist (0.0.0.0/0)
- Test connection string locally

#### Email Not Sending
- Verify credentials
- Check SendGrid/Gmail quotas
- Review email service logs

---

## 💰 Costs (Free Tier Limits)

### Railway
- $5 free credit/month
- Enough for small apps

### Vercel
- Unlimited deployments
- 100GB bandwidth/month

### MongoDB Atlas
- 512MB storage (M0)
- Shared RAM
- Good for 100+ users

### SendGrid
- 100 emails/day free
- Upgrade for more

**Total: $0/month for small office use** ✅

---

## 📊 Scaling

### If You Grow

#### Database
- Upgrade MongoDB tier
- Add indexes
- Enable caching

#### Backend
- Scale Railway instances
- Use Redis for sessions
- CDN for static files

#### Frontend
- Already on CDN (Vercel/Netlify)
- Optimize images
- Code splitting

---

## 🎯 Production Seed

### Don't Seed in Production!

Instead:
1. Use admin dashboard to add users
2. Or create migration script:

```javascript
// server/seed/prodSeed.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const prodUsers = [
  { name: 'John Doe', email: 'john@company.com', role: 'admin' },
  { name: 'Jane Smith', email: 'jane@company.com' },
  // ... your real users
];

const seedProd = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.insertMany(prodUsers);
  console.log('Production users created');
  process.exit();
};

seedProd();
```

---

## 📝 Deployment Checklist

### Before Deploy
- [ ] Test locally
- [ ] Update environment variables
- [ ] Change JWT secret
- [ ] Configure email
- [ ] Set up MongoDB Atlas
- [ ] Test production build

### During Deploy
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update CORS settings
- [ ] Test all endpoints
- [ ] Create admin user

### After Deploy
- [ ] Test complete flow
- [ ] Send test email
- [ ] Upload test gift
- [ ] Check mobile version
- [ ] Monitor logs

---

## 🎉 Success!

Your Secret Santa app is now live! 🎅

### Share With Team
```
🎄 Secret Santa App is Live!

URL: https://your-app.vercel.app

Login with your email and OTP: 1234
(Admin will update this for production)

Have fun! 🎁
```

---

## 📚 Resources

### Documentation
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [SendGrid Docs](https://docs.sendgrid.com)

### Support
- Railway Discord
- Vercel Discord
- Stack Overflow

---

## 🎁 Final Notes

- **Start Small**: Use free tiers first
- **Monitor**: Check logs regularly
- **Backup**: Export data periodically
- **Update**: Keep dependencies current
- **Enjoy**: Celebrate with your team! 🎅🎄

**Happy Deploying!** 🚀
