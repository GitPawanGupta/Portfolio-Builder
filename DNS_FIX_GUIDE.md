# DNS Fix Guide for MongoDB Atlas Connection

## Problem
Your local DNS server cannot resolve MongoDB Atlas hostnames, causing connection failures.

## Solution: Change DNS to Google DNS

### Windows DNS Change Steps:

1. **Open Network Settings**
   - Press `Win + R`
   - Type `ncpa.cpl` and press Enter
   - OR go to Settings → Network & Internet → Change adapter options

2. **Configure DNS**
   - Right-click your active network connection (Wi-Fi or Ethernet)
   - Click "Properties"
   - Select "Internet Protocol Version 4 (TCP/IPv4)"
   - Click "Properties"

3. **Set Google DNS**
   - Select "Use the following DNS server addresses"
   - Preferred DNS server: `8.8.8.8`
   - Alternate DNS server: `8.8.4.4`
   - Click "OK" on all windows

4. **Flush DNS Cache**
   Open Command Prompt as Administrator and run:
   ```cmd
   ipconfig /flushdns
   ```

5. **Test Connection**
   ```cmd
   nslookup helpdesk-cluster.hlw9wff.mongodb.net
   ```
   Should now resolve successfully!

6. **Restart Backend**
   The MongoDB connection should now work!

## Alternative: Quick Test Without Changing System DNS

You can also try temporarily:
1. Disconnect and reconnect to your Wi-Fi/network
2. Restart your router
3. Wait a few minutes and try again

## After DNS Fix

Once DNS is working, restart the backend server and it should connect to MongoDB Atlas successfully!
