# Install MongoDB Locally (Best Option - No DNS Change Needed)

## Why Local MongoDB?
- ✅ No network/DNS changes needed
- ✅ Safe for company systems
- ✅ Fast and reliable
- ✅ Works offline
- ✅ Full control over data

## Installation Steps

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **IMPORTANT:** Check "Install MongoDB as a Service"
4. **IMPORTANT:** Check "Install MongoDB Compass" (GUI tool)
5. Click "Next" and "Install"
6. Wait for installation to complete

### Step 3: Verify Installation
Open Command Prompt and run:
```cmd
mongod --version
```

You should see MongoDB version information.

### Step 4: Start MongoDB Service
MongoDB should start automatically. If not, run as Administrator:
```cmd
net start MongoDB
```

### Step 5: Update Backend Configuration
The `.env` file is already configured for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/portfolio-builder
```

Just restart the backend server!

### Step 6: Seed Database
Run this command in the backend folder:
```cmd
cd backend
npm run seed
```

This will create:
- Default admin user (admin@portfoliobuilder.com / admin123)
- Default template

### Step 7: Test
1. Backend will automatically connect to local MongoDB
2. Login to admin panel
3. All features will work!

## MongoDB Compass (GUI)
MongoDB Compass is installed automatically. Use it to:
- View your database
- Browse collections
- Run queries
- Monitor performance

Connection string: `mongodb://localhost:27017`

## Troubleshooting

### MongoDB Service Not Starting
Run as Administrator:
```cmd
net start MongoDB
```

### Port 27017 Already in Use
Check if another MongoDB instance is running:
```cmd
netstat -ano | findstr :27017
```

### Can't Connect
1. Check if MongoDB service is running:
   ```cmd
   sc query MongoDB
   ```
2. Check firewall settings
3. Restart MongoDB service

## Advantages Over MongoDB Atlas
- ✅ No internet required
- ✅ No DNS issues
- ✅ Faster (local connection)
- ✅ No IP whitelist needed
- ✅ Full data privacy
- ✅ No connection limits

## Next Steps After Installation
1. MongoDB will be running on `localhost:27017`
2. Backend will automatically connect
3. Run seed script to create admin user
4. Login and start using the application!
