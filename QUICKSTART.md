# Portfolio Builder - Quick Start Guide

## 🚀 Fastest Way to Get Started

### Windows Users

1. **Install Dependencies**
   ```bash
   install.bat
   ```

2. **Start Application**
   ```bash
   start.bat
   ```

### Mac/Linux Users

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend && npm install && cd ..
   
   # Frontend
   cd frontend && npm install && cd ..
   
   # Seed Database
   cd backend && npm run seed && cd ..
   ```

2. **Start Application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 📱 Access the Application

### Public Form
**URL:** http://localhost:5173

Submit lead applications with resume upload.

### Admin Panel
**URL:** http://localhost:5173/login

**Default Credentials:**
- Email: `admin@portfoliobuilder.com`
- Password: `admin123`

⚠️ **Change these credentials in production!**

## ✅ Quick Test

1. **Submit a Lead**
   - Go to http://localhost:5173
   - Fill the form
   - Upload a resume (PDF/DOC/DOCX)
   - Submit

2. **Login to Admin**
   - Go to http://localhost:5173/login
   - Use default credentials
   - View dashboard

3. **Manage Lead**
   - Click on the lead
   - Update status
   - Add notes
   - Generate portfolio
   - Send via email/WhatsApp (if configured)

## 🔧 Configuration (Optional)

### Email Setup
Edit `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### WhatsApp Setup
Edit `backend/.env`:
```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
```

## 📚 Full Documentation

- **Setup Guide:** See `SETUP.md`
- **README:** See `README.md`
- **Spec Documents:** See `.kiro/specs/portfolio-builder/`

## 🆘 Troubleshooting

### MongoDB Not Running
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Dependencies Issues
```bash
# Clear and reinstall
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

## 🎯 Next Steps

1. ✅ Test the application
2. ✅ Configure email/WhatsApp
3. ✅ Customize templates
4. ✅ Deploy to production

Happy building! 🚀
