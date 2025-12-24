# 🎅 Secret Santa Setup Guide

## Quick Start (5 minutes)

### Step 1: Copy Environment Files

**Backend (.env):**
\`\`\`bash
# Copy this to .env in the root directory
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/secret-santa
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-secretsanta2025
REVEAL_DATE=2025-12-25T00:00:00Z
FRONTEND_URL=http://localhost:5173
MAX_PARTICIPANTS=30

# Email (Optional - can skip for local testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Secret Santa <noreply@secretsanta.com>
\`\`\`

**Frontend (client/.env):**
\`\`\`bash
# Copy this to client/.env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### Step 2: Ensure MongoDB is Running

\`\`\`bash
# Check if MongoDB is installed
mongod --version

# Start MongoDB (if not already running)
mongod
\`\`\`

### Step 3: Seed the Database

\`\`\`bash
# From the root directory
npm run seed
\`\`\`

This will create 30 sample users.

### Step 4: Start the Application

\`\`\`bash
# Start both backend and frontend
npm run dev
\`\`\`

### Step 5: Login

Open http://localhost:5173

**Admin Login:**
- Email: alice.johnson@company.com  
- OTP: 1234

**Regular User:**
- Email: bob.smith@company.com
- OTP: 1234

### Step 6: Generate Pairings (Admin Only)

1. Login as admin
2. Go to Admin Dashboard
3. Click "Generate Pairings"
4. Emails will be sent (or logged to console if email not configured)

### Step 7: Test the Flow

1. **As Admin**: Generate pairings
2. **As User**: View assignment, submit gift
3. **As Admin**: Unlock reveal
4. **As User**: Click reveal and enjoy the animation! 🎉

---

## Setting Up Email (Optional)

### For Gmail:

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to Security → App Passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Update `.env`:
   \`\`\`
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   \`\`\`

### For Other Providers:

Update these in `.env`:
\`\`\`
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
\`\`\`

---

## Customization

### Change Reveal Date

Edit `.env`:
\`\`\`
REVEAL_DATE=2025-12-30T18:00:00Z
\`\`\`

### Change Theme Colors

Edit `client/tailwind.config.js`:
\`\`\`js
colors: {
  christmas: {
    red: '#C31432',    // Main red color
    green: '#165E3D',  // Main green color
    gold: '#FFD700',   // Accent gold
  },
}
\`\`\`

### Add More Users

Edit `server/seed/seedData.js` and add users to `sampleUsers` array, then re-run:
\`\`\`bash
npm run seed
\`\`\`

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB is running: `mongod --version`
- Start MongoDB service
- Verify connection string in `.env`

### "Port 5000 already in use"
- Change PORT in `.env` to 5001 or another available port

### Emails not sending
- For local testing, emails are logged to console
- Check email credentials are correct
- Verify Gmail App Password (not regular password)

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `client/.env`

---

## Production Deployment

### Backend (e.g., Railway/Render/Heroku)

1. Set environment variables in hosting platform
2. Set `NODE_ENV=production`
3. Use production MongoDB URI (MongoDB Atlas)
4. Configure real email service

### Frontend (e.g., Vercel/Netlify)

1. Build: `cd client && npm run build`
2. Set `VITE_API_URL` to production API URL
3. Deploy `client` folder

---

## Need Help?

Check the main README.md for detailed documentation!

🎄 Happy Secret Santa! 🎁
