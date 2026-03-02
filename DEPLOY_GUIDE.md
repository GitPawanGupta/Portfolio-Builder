# Google Cloud Deployment Guide

## Prerequisites
- Google Cloud account
- gcloud CLI installed
- Project ID: project-df5557df-0863-4f74-a10

## Deployment Steps

### 1. Clone Repository
```bash
git clone https://github.com/GitPawanGupta/Portfolio-Builder.git
cd Portfolio-Builder
```

### 2. Set Google Cloud Project
```bash
gcloud config set project project-df5557df-0863-4f74-a10
```

### 3. Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 4. Deploy Backend to Cloud Run
```bash
cd backend
gcloud builds submit --tag gcr.io/project-df5557df-0863-4f74-a10/portfolio-backend
gcloud run deploy portfolio-backend \
  --image gcr.io/project-df5557df-0863-4f74-a10/portfolio-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=mongodb+srv://erpawan459_db_user:alhFC6pCako72e3n@helpdesk-cluster.hlw9wff.mongodb.net/portfoliobuilder,JWT_SECRET=your-super-secret-jwt-key-change-this-in-production,NODE_ENV=production,CORS_ORIGIN=*"
cd ..
```

### 5. Get Backend URL
```bash
gcloud run services describe portfolio-backend --platform managed --region asia-south1 --format 'value(status.url)'
```

### 6. Update Frontend Environment
Update `frontend/.env` with backend URL:
```
VITE_API_URL=<BACKEND_URL>/api
```

### 7. Deploy Frontend to Cloud Run
```bash
cd frontend
gcloud builds submit --tag gcr.io/project-df5557df-0863-4f74-a10/portfolio-frontend
gcloud run deploy portfolio-frontend \
  --image gcr.io/project-df5557df-0863-4f74-a10/portfolio-frontend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
cd ..
```

### 8. Seed Database
```bash
# SSH into backend container or run locally
cd backend
npm run seed
```

## Alternative: Deploy with Docker Compose on Compute Engine

### 1. Create VM Instance
```bash
gcloud compute instances create portfolio-builder \
  --zone=asia-south1-a \
  --machine-type=e2-medium \
  --image-family=cos-stable \
  --image-project=cos-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server
```

### 2. Configure Firewall
```bash
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --target-tags http-server

gcloud compute firewall-rules create allow-backend \
  --allow tcp:5000 \
  --target-tags http-server
```

### 3. SSH into VM
```bash
gcloud compute ssh portfolio-builder --zone=asia-south1-a
```

### 4. Install Docker & Docker Compose
```bash
# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 5. Clone and Deploy
```bash
git clone https://github.com/GitPawanGupta/Portfolio-Builder.git
cd Portfolio-Builder

# Set environment variables
export MONGODB_URI="mongodb+srv://erpawan459_db_user:alhFC6pCako72e3n@helpdesk-cluster.hlw9wff.mongodb.net/portfoliobuilder"
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
export CORS_ORIGIN="*"

# Start services
sudo docker-compose up -d
```

### 6. Get External IP
```bash
gcloud compute instances describe portfolio-builder --zone=asia-south1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

## Access Application

- Frontend: http://<EXTERNAL_IP>
- Backend API: http://<EXTERNAL_IP>:5000/api
- Admin Login: admin@pasuai.online / admin123

## Monitoring

```bash
# View logs
gcloud run services logs read portfolio-backend --region asia-south1
gcloud run services logs read portfolio-frontend --region asia-south1

# Or for Compute Engine
sudo docker-compose logs -f
```

## Update Deployment

```bash
git pull origin main
sudo docker-compose down
sudo docker-compose up -d --build
```

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify MONGODB_URI environment variable

### CORS errors
- Update CORS_ORIGIN to frontend URL
- Restart backend service

### Port issues
- Ensure firewall rules allow ports 80 and 5000
- Check if ports are already in use
