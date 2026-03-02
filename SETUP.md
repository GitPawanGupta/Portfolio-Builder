# Portfolio Builder - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ (https://nodejs.org/)
- MongoDB 6+ (https://www.mongodb.com/try/download/community)
- npm or yarn

## Quick Start

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 3. Seed Database

Create default admin user and template:

```bash
cd backend
npm run seed
```

This will create:
- Admin user: `admin@portfoliobuilder.com` / `admin123`
- Default portfolio template

### 4. Start Development Servers

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## Access the Application

### Public Form
Visit: http://localhost:5173

Submit lead applications with resume upload.

### Admin Panel
Visit: http://localhost:5173/login

Login with:
- Email: `admin@portfoliobuilder.com`
- Password: `admin123`

## Configuration

### Email Setup (Optional)

To enable email sending, update `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in SMTP_PASS

### WhatsApp Setup (Optional)

#### Option 1: Twilio
```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

#### Option 2: Meta WhatsApp Cloud
```env
WHATSAPP_PROVIDER=meta
META_WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
META_WHATSAPP_ACCESS_TOKEN=your-access-token
```

### AWS S3 Setup (Production)

For production file storage:

```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## Testing the Application

### 1. Submit a Lead
1. Go to http://localhost:5173
2. Fill out the form
3. Upload a resume (PDF/DOC/DOCX)
4. Submit

### 2. Manage Leads
1. Login to admin panel
2. View dashboard statistics
3. Click on a lead to see details
4. Update status, add notes
5. Generate portfolio
6. Send via email/WhatsApp

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `backend/.env`

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### File Upload Issues
- Check `backend/uploads` directory exists
- Verify file permissions

### Email Not Sending
- Verify SMTP credentials
- Check firewall settings
- For Gmail, use App Password

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure AWS S3 for file storage
4. Set up proper SMTP service
5. Deploy to Heroku/Railway/DigitalOcean

### Frontend
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Update VITE_API_URL to production API

### Database
1. Use MongoDB Atlas (cloud)
2. Update MONGODB_URI

## Support

For issues or questions:
- Check the README.md
- Review the spec documents in `.kiro/specs/portfolio-builder/`

## Next Steps

1. ✅ Test lead submission
2. ✅ Test admin login
3. ✅ Configure email/WhatsApp
4. ✅ Customize templates
5. ✅ Deploy to production

Happy building! 🚀
