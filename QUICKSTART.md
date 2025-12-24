# 🎅 SECRET SANTA - QUICK START GUIDE 🎁

## ✅ Setup Complete!

Your Secret Santa application is ready! Here's how to get started:

---

## 📦 What's Included

✅ Full MERN Stack Application
✅ 30 Sample Users (seeded)
✅ Admin Dashboard
✅ Beautiful Christmas Theme
✅ 3D Flip Animations
✅ Confetti Effects
✅ Dark Mode
✅ Mobile Responsive
✅ Email Integration Ready

---

## 🚀 QUICK START (3 Steps)

### 1️⃣ Start MongoDB
\`\`\`bash
# Make sure MongoDB is running
mongod
\`\`\`

### 2️⃣ Seed Database
\`\`\`bash
npm run seed
\`\`\`

### 3️⃣ Run Application
\`\`\`bash
npm run dev
\`\`\`

**That's it!** Open http://localhost:5173

---

## 🔑 Login Credentials

### Admin Account:
- **Email**: alice.johnson@company.com
- **OTP**: 1234

### Regular Users:
- bob.smith@company.com
- charlie.brown@company.com
- diana.prince@company.com
- (and 27 more... see seed data)
- **OTP for all**: 1234

---

## 📖 Admin Workflow

1. Login as admin (alice.johnson@company.com)
2. Go to **Admin Dashboard**
3. Click **"Generate Pairings"** button
4. ✅ Pairings created + emails sent!
5. Monitor user progress in dashboard
6. When ready: Click **"Unlock Reveal"**
7. Download CSV report if needed

---

## 📖 User Workflow

1. Login with email (OTP: 1234)
2. View **Home** page with countdown
3. Go to **My Assignment** page
4. See who you're giving a gift to
5. Upload gift image + add message
6. Wait for reveal day...
7. Click **Reveal** and enjoy the 3D flip animation! 🎉

---

## 🎨 Features to Try

### Animations
- ❄️ **Snowfall** background
- 🎴 **3D Card Flip** on reveal
- 🎊 **Confetti** celebration
- ⏱️ **Countdown Timer** with live updates
- 💫 **Smooth transitions** everywhere

### Functionality
- 📧 **Email notifications** (check console if not configured)
- 👥 **User management** (admin)
- 📊 **Statistics dashboard** (admin)
- 📥 **CSV export** (admin)
- 🔒 **One-time reveal** enforcement
- 🌙 **Dark mode** toggle

---

## 🎯 Testing Checklist

- [ ] Login as admin
- [ ] Generate pairings
- [ ] Login as regular user
- [ ] View assignment
- [ ] Upload gift with image
- [ ] Go to reveal page (before unlock)
- [ ] Admin unlocks reveal
- [ ] Click reveal button
- [ ] Watch 3D flip animation + confetti
- [ ] Toggle dark mode
- [ ] Try on mobile device
- [ ] Export CSV as admin

---

## 🛠️ Customization

### Change Reveal Date
Edit `.env`:
\`\`\`
REVEAL_DATE=2025-12-30T18:00:00Z
\`\`\`

### Change Theme Colors
Edit `client/tailwind.config.js`

### Add More Users
Edit `server/seed/seedData.js` and run `npm run seed`

---

## 📁 Project Structure

\`\`\`
secret-santa/
├── server/              # Backend (Express + MongoDB)
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & upload
│   ├── utils/           # Pairing algorithm & emails
│   └── server.js
│
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Main pages
│   │   ├── context/     # State management
│   │   └── services/    # API calls
│   └── ...
│
└── package.json         # Main scripts
\`\`\`

---

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 🐛 Common Issues

### MongoDB Connection Error
- Check MongoDB is running: `mongod --version`
- Start service: `mongod`

### Port Already in Use
- Change PORT in `.env`

### Can't Login
- Make sure you ran: `npm run seed`
- Use OTP: 1234

### Uploads Not Working
- Folder created automatically
- Check `server/uploads/gifts/` exists

---

## 📧 Email Setup (Optional)

For Gmail:
1. Enable 2FA
2. Generate App Password
3. Update `.env`:
   \`\`\`
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   \`\`\`

---

## 🎓 Learn More

- See `README.md` for full documentation
- See `SETUP.md` for detailed setup guide
- Check code comments for implementation details

---

## 🎉 Have Fun!

This is a fully functional Secret Santa application with:

✨ Beautiful UI/UX
✨ Smooth animations
✨ Production-ready code
✨ Well-documented
✨ Easy to customize

**Enjoy your Secret Santa celebration!** 🎅🎄🎁

---

## 💝 Created With

- React + Vite
- Tailwind CSS
- Framer Motion
- Express + MongoDB
- And lots of Christmas spirit! ❤️

**Need help?** Check the documentation or code comments!

🎄 **Merry Christmas!** 🎅
