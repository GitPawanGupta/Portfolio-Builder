# MongoDB Installation - Easy Steps (5 Minutes)

## Step 1: Download MongoDB (1 minute)

**Direct Download Link:**
https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi

OR

Go to: https://www.mongodb.com/try/download/community
- Version: 7.0.5 (Current)
- Platform: Windows x64
- Package: MSI
- Click "Download"

## Step 2: Install MongoDB (3 minutes)

1. **Run the downloaded .msi file**
   - Double-click the downloaded file
   - Click "Next"

2. **Accept License Agreement**
   - Check "I accept the terms"
   - Click "Next"

3. **Choose Setup Type**
   - Select "Complete"
   - Click "Next"

4. **Service Configuration (IMPORTANT!)**
   - ✅ Check "Install MongoDB as a Service"
   - Service Name: MongoDB
   - Data Directory: C:\Program Files\MongoDB\Server\7.0\data\
   - Log Directory: C:\Program Files\MongoDB\Server\7.0\log\
   - Click "Next"

5. **Install MongoDB Compass (Optional but Recommended)**
   - ✅ Check "Install MongoDB Compass"
   - This gives you a GUI to view your database
   - Click "Next"

6. **Install**
   - Click "Install"
   - Wait 2-3 minutes for installation
   - Click "Finish"

## Step 3: Verify Installation (30 seconds)

Open Command Prompt and run:
```cmd
mongod --version
```

You should see something like:
```
db version v7.0.5
```

## Step 4: Check MongoDB Service (30 seconds)

MongoDB should start automatically. To verify:
```cmd
sc query MongoDB
```

You should see:
```
STATE: 4 RUNNING
```

If not running, start it:
```cmd
net start MongoDB
```

## Step 5: Seed Database (30 seconds)

In your project, run:
```cmd
cd backend
npm run seed
```

This creates:
- ✅ Admin user: admin@portfoliobuilder.com / admin123
- ✅ Default template

## Step 6: Restart Backend

The backend will automatically detect MongoDB and connect!

Check backend console - you should see:
```
MongoDB Connected: localhost
```

## Step 7: Test Application

1. Go to http://localhost:5173
2. Fill the form and submit
3. It should work! ✅

## Troubleshooting

### MongoDB Service Won't Start
Run as Administrator:
```cmd
net start MongoDB
```

### Port 27017 Already in Use
Check what's using it:
```cmd
netstat -ano | findstr :27017
```

### Still Can't Connect
1. Restart your computer
2. Check Windows Services (services.msc)
3. Find "MongoDB" and start it

## What You Get

After installation:
- ✅ MongoDB running on localhost:27017
- ✅ Automatic startup with Windows
- ✅ MongoDB Compass (GUI tool)
- ✅ Full database functionality
- ✅ No internet required
- ✅ Fast local connection

## MongoDB Compass Usage

After installation, open MongoDB Compass:
1. Connection String: `mongodb://localhost:27017`
2. Click "Connect"
3. You'll see your "portfolio-builder" database
4. Browse collections: leads, admins, portfolios, etc.

---

**Total Time: ~5 minutes**
**Difficulty: Easy**
**Safe for Company Systems: Yes (no network changes)**
