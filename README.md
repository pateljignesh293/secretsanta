# 🎅 Secret Santa Web Application

A full-stack MERN application for organizing office Secret Santa gift exchanges with beautiful animations, real-time features, and a festive Christmas theme.

## ✨ Features

### 🎁 Core Features
- **Magic Link / OTP Authentication** - Passwordless login system
- **Secret Santa Pairing Algorithm** - Circular distribution ensuring everyone gives and receives
- **Gift Submission** - Upload gift images with personal messages
- **Reveal Experience** - 3D card flip animation with confetti celebration
- **Admin Dashboard** - Complete management interface for organizers
- **Email Notifications** - Automatic emails for pairings and reveal reminders
- **CSV Export** - Download pairing data for records

### 🎨 UI/UX Features
- **Christmas Theme** - Festive red, green, and gold color scheme
- **Dark Mode** - Toggle between light and dark themes
- **Animated Snowfall** - Subtle background animation
- **Smooth Animations** - Framer Motion for all interactions
- **Mobile Responsive** - Works perfectly on all devices
- **Loading States** - Skeleton screens and spinners
- **Toast Notifications** - User-friendly feedback

### 🔒 Security
- JWT authentication
- Protected routes
- Admin-only access controls
- One-time reveal enforcement
- Rate limiting
- Input validation

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JSON Web Tokens** - Authentication
- **Multer** - File uploads
- **Nodemailer** - Email service
- **Helmet** - Security headers

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **React Confetti** - Celebration effects

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
cd d:/working/secretsanta

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
\`\`\`

### 2. Configure Environment Variables

**Backend (.env in root):**
\`\`\`env
# Copy from .env.example and update
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/secret-santa
JWT_SECRET=your-super-secret-jwt-key-change-this
REVEAL_DATE=2025-12-25T00:00:00Z
FRONTEND_URL=http://localhost:5173
\`\`\`

**Frontend (client/.env):**
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 3. Start MongoDB

\`\`\`bash
# Make sure MongoDB is running
mongod
\`\`\`

### 4. Seed Database

\`\`\`bash
# From root directory
npm run seed
\`\`\`

This creates 30 sample users including an admin.

### 5. Run the Application

**Option A: Run Both (Recommended)**
\`\`\`bash
npm run dev
\`\`\`

**Option B: Run Separately**
\`\`\`bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
\`\`\`

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 👤 Sample Credentials

### Admin Login
- **Email**: alice.johnson@company.com
- **OTP**: 1234 (for demo)

### Regular User Login
- **Email**: bob.smith@company.com
- **OTP**: 1234

(See all 30 users in seed data)

## 📁 Project Structure

\`\`\`
secret-santa/
├── server/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Pairing.js
│   │   ├── Gift.js
│   │   └── Settings.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── pairings.js
│   │   ├── gifts.js
│   │   ├── settings.js
│   │   └── admin.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/            # Utility functions
│   │   ├── emailService.js
│   │   └── pairingAlgorithm.js
│   ├── seed/             # Database seeding
│   │   └── seedData.js
│   ├── uploads/          # File uploads
│   └── server.js         # Entry point
├── client/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Snowfall.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Assignment.jsx
│   │   │   ├── Reveal.jsx
│   │   │   └── Admin.jsx
│   │   ├── context/      # React context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/     # API services
│   │   │   └── api.js
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   └── index.html
└── package.json
\`\`\`

## 🎮 User Flow

### For Participants:

1. **Login** - Use email + OTP/magic link
2. **View Assignment** - See who you're giving a gift to
3. **Submit Gift** - Upload image and message
4. **Wait for Reveal** - Countdown timer shows time remaining
5. **Reveal** - Experience 3D flip animation and see your Secret Santa

### For Admins:

1. **Login** as admin
2. **Add Participants** - Manage user list
3. **Generate Pairings** - Run algorithm and send notifications
4. **Monitor Progress** - View stats and submission rates
5. **Control Reveal** - Lock/unlock reveal feature
6. **Export Data** - Download CSV report

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/request-login` - Request magic link
- `POST /api/auth/verify-token` - Verify and login
- `POST /api/auth/simulate-otp` - OTP login (demo)

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users` - List users

### Pairings
- `GET /api/pairings/my-assignment` - Get assignment
- `GET /api/pairings/reveal` - Reveal Secret Santa
- `GET /api/pairings/status` - Get status

### Gifts
- `POST /api/gifts/submit` - Submit gift (multipart)
- `GET /api/gifts/my-gift` - Get submitted gift
- `DELETE /api/gifts/my-gift` - Delete gift

### Admin
- `GET /admin/users` - Manage users
- `POST /admin/generate-pairings` - Generate pairings
- `GET /admin/pairings` - View all pairings
- `GET /admin/export-pairings` - Export CSV
- `PUT /admin/settings` - Update settings
- `GET /admin/stats` - Dashboard statistics

## 🎨 Customization

### Theme Colors
Edit `client/tailwind.config.js`:
\`\`\`js
colors: {
  christmas: {
    red: '#C31432',
    green: '#165E3D',
    gold: '#FFD700',
  },
}
\`\`\`

### Reveal Date
Update `.env`:
\`\`\`
REVEAL_DATE=2025-12-25T00:00:00Z
\`\`\`

### Max Participants
\`\`\`
MAX_PARTICIPANTS=30
\`\`\`

## 📧 Email Configuration

For production, configure email service (Gmail example):

1. Enable 2FA on Gmail
2. Generate App Password
3. Update `.env`:
\`\`\`
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
\`\`\`

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Configure email service
4. Deploy to Heroku/Railway/Render

### Frontend
1. Build: `npm run build` (in client folder)
2. Set `VITE_API_URL` to production API
3. Deploy to Vercel/Netlify

## 🐛 Troubleshooting

### MongoDB Connection Issues
\`\`\`bash
# Check MongoDB is running
mongod --version

# Start MongoDB service
mongod
\`\`\`

### Port Already in Use
\`\`\`bash
# Change PORT in .env file
PORT=5001
\`\`\`

### Email Not Sending
- Check email credentials in `.env`
- Verify Gmail App Password (not regular password)
- For development, emails are logged to console

## 📝 License

MIT License - Feel free to use for your office celebrations!

## 🎄 Happy Secret Santa! 🎁

Built with ❤️ for making office celebrations more fun and magical!

---

## 🌟 Key Features Summary

✅ Magic Link / OTP Authentication
✅ Secret Santa Pairing Algorithm
✅ Gift Upload with Image Storage
✅ 3D Card Flip Reveal Animation
✅ Confetti Celebration
✅ Email Notifications
✅ Admin Dashboard
✅ CSV Export
✅ Dark Mode
✅ Mobile Responsive
✅ Animated Snowfall
✅ Countdown Timer
✅ Production Ready
✅ Well Commented Code
✅ Seed Data for 30 Users

Enjoy your Secret Santa celebration! 🎅🎄🎁
