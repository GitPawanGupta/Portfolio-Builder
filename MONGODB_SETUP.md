# MongoDB Setup Guide

## Current Status
✅ **Admin Login is now working WITHOUT MongoDB!**

The system has been configured to use a temporary in-memory admin when MongoDB is not connected.

### Test Admin Credentials
- **Email:** admin@portfoliobuilder.com
- **Password:** admin123

## What Works Without MongoDB
- ✅ Admin login
- ✅ Admin authentication
- ✅ Protected routes
- ✅ Frontend navigation

## What Needs MongoDB
- ❌ Viewing leads
- ❌ Creating portfolios
- ❌ Dashboard statistics
- ❌ Activity logs
- ❌ Storing actual data

## Setup Options

### Option 1: MongoDB Atlas (Recommended - Free & Easy)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0 - Free tier)
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-builder
   ```
6. Restart the backend server
7. Run seed script: `cd backend && npm run seed`

### Option 2: Install MongoDB Locally
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac/Linux: `sudo systemctl start mongod`
4. Run seed script: `cd backend && npm run seed`

### Option 3: Continue Testing Without MongoDB
You can continue testing the UI and admin panel navigation without MongoDB. The system will show empty data but won't crash.

## Running the Seed Script
Once MongoDB is connected, create the default admin and templates:

```bash
cd backend
npm run seed
```

This will create:
- Default admin user (admin@portfoliobuilder.com / admin123)
- Default portfolio template

## Verifying MongoDB Connection
Check the backend console output. You should see:
```
MongoDB Connected: [hostname]
```

Instead of:
```
MongoDB Connection Error: connect ECONNREFUSED
```

## Next Steps
1. Try logging in with the test credentials
2. Explore the admin panel UI
3. When ready for full functionality, set up MongoDB using one of the options above
