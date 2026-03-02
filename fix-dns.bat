@echo off
echo ========================================
echo DNS Fix for MongoDB Atlas Connection
echo ========================================
echo.
echo Flushing DNS cache...
ipconfig /flushdns
echo.
echo Testing MongoDB hostname resolution...
nslookup helpdesk-cluster.hlw9wff.mongodb.net 8.8.8.8
echo.
echo ========================================
echo If you see IP addresses above, DNS is working!
echo Now restart the backend server.
echo ========================================
pause
