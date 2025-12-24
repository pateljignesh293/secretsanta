@echo off
echo Creating .env file in root...
(
echo PORT=5000
echo NODE_ENV=development
echo MONGODB_URI=mongodb://localhost:27017/secret-santa
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-secretsanta2025
echo REVEAL_DATE=2025-12-25T00:00:00Z
echo FRONTEND_URL=http://localhost:5173
echo MAX_PARTICIPANTS=30
echo.
echo # Email Configuration ^(Optional^)
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=your-email@gmail.com
echo EMAIL_PASSWORD=your-app-password
echo EMAIL_FROM=Secret Santa ^<noreply@secretsanta.com^>
) > .env

echo Creating .env file in client...
(
echo VITE_API_URL=http://localhost:5000/api
) > client\.env

echo.
echo ✅ Environment files created successfully!
echo.
echo Next steps:
echo 1. Ensure MongoDB is running
echo 2. Run: npm run seed
echo 3. Run: npm run dev
echo.
pause
