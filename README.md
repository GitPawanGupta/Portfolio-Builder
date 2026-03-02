# Portfolio Builder System

A complete lead management and portfolio generation platform with public form submission, admin panel, and automated portfolio delivery via email/WhatsApp.

## Features

### MVP Features
- ✅ Lead form with resume upload (PDF/DOC/DOCX)
- ✅ Admin authentication (JWT)
- ✅ Lead management with status workflow
- ✅ Portfolio generation with templates
- ✅ Email delivery (Nodemailer)
- ✅ File storage (Local/AWS S3)

### Pro Features
- ✅ Multiple portfolio templates
- ✅ WhatsApp delivery (Twilio/Meta)
- ✅ Activity logging
- ✅ Lead source tracking (UTM)
- ✅ CSV export
- ✅ Dashboard analytics

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file upload)
- Nodemailer (email)
- Twilio/Meta WhatsApp API

### Frontend
- React 18 + Vite
- TailwindCSS
- React Router v6
- React Hook Form + Zod
- React Query
- Axios

## Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed  # Create default admin and template
npm run dev   # Start development server
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev   # Start development server
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio-builder
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Default Admin Credentials

After running seed script:
- Email: admin@portfoliobuilder.com
- Password: admin123

**⚠️ Change these credentials in production!**

## API Endpoints

### Public
- `POST /api/leads` - Submit lead form
- `GET /api/leads/track/:id` - Track lead status

### Auth
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Admin
- `GET /api/admin/leads` - List leads (with filters)
- `GET /api/admin/leads/:id` - Get lead details
- `PATCH /api/admin/leads/:id` - Update lead
- `GET /api/admin/templates` - List templates
- `POST /api/admin/portfolio/generate` - Generate portfolio
- `POST /api/admin/portfolio/send` - Send portfolio
- `GET /api/admin/export/leads` - Export CSV

## Project Structure

```
portfolio-builder/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Express middlewares
│   │   ├── utils/        # Utilities
│   │   └── server.js     # Entry point
│   └── uploads/          # Local file storage
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utilities
│   │   └── main.jsx      # Entry point
│   └── public/           # Static assets
└── .kiro/specs/          # Specification documents
```

## Development

### Run Tests
```bash
cd backend
npm test
```

### Build for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Deployment

### Backend
1. Set up MongoDB (Atlas recommended)
2. Configure AWS S3 for file storage
3. Set up SMTP service (SendGrid/Mailgun)
4. Configure WhatsApp API (Twilio/Meta)
5. Deploy to Heroku/Railway/DigitalOcean

### Frontend
1. Build: `npm run build`
2. Deploy to Vercel/Netlify/Cloudflare Pages

## License

MIT
