@echo off
echo ========================================
echo MongoDB Atlas Connection Setup
echo ========================================
echo.
echo STEP 1: Testing current DNS resolution...
echo.
nslookup helpdesk-cluster.hlw9wff.mongodb.net
echo.
echo ========================================
echo.
echo If you see "No internal type for both IPv4 and IPv6", then DNS is not working.
echo.
echo STEP 2: Change DNS to Google DNS
echo ----------------------------------------
echo 1. Press Win + R
echo 2. Type: ncpa.cpl and press Enter
echo 3. Right-click your Wi-Fi/Ethernet
echo 4. Click Properties
echo 5. Select "Internet Protocol Version 4 (TCP/IPv4)"
echo 6. Click Properties
echo 7. Select "Use the following DNS server addresses"
echo 8. Preferred DNS: 8.8.8.8
echo 9. Alternate DNS: 8.8.4.4
echo 10. Click OK
echo.
echo STEP 3: After changing DNS, run this command:
echo ipconfig /flushdns
echo.
echo STEP 4: Test again with:
echo nslookup helpdesk-cluster.hlw9wff.mongodb.net
echo.
echo If it shows IP addresses, MongoDB will connect!
echo ========================================
pause
