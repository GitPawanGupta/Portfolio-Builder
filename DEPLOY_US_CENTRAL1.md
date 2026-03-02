# Deploy to us-central1 Region

## Step 1: Create Artifact Registry Repository in US Region

```bash
gcloud artifacts repositories create portfolio-repo \
  --repository-format=docker \
  --location=us \
  --description="Portfolio Builder Docker Repository"
```

## Step 2: Configure Docker Authentication

```bash
gcloud auth configure-docker us-docker.pkg.dev
```

## Step 3: Set Environment Variables

```bash
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1
```

## Step 4: Build and Deploy Backend

```bash
cd ~/Portfolio-Builder/backend

# Build and push backend image
gcloud builds submit --tag us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/backend:latest

# Deploy to Cloud Run
gcloud run deploy portfolio-backend \
  --image us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,MONGODB_URI=mongodb+srv://erpawan459_db_user:alhFC6pCako72e3n@helpdesk-cluster.hlw9wff.mongodb.net/portfoliobuilder,JWT_SECRET=your-super-secret-jwt-key-change-this-in-production,JWT_EXPIRES_IN=7d,CORS_ORIGIN=https://portfolio-frontend-PLACEHOLDER.run.app"
```

**Note the backend URL from the output!**

## Step 5: Update Frontend Dockerfile with Backend URL

Before building frontend, update `frontend/Dockerfile` line 13:
```dockerfile
ENV VITE_API_URL=https://YOUR-BACKEND-URL/api
```

Replace `YOUR-BACKEND-URL` with the actual backend URL from Step 4.

## Step 6: Build and Deploy Frontend

```bash
cd ~/Portfolio-Builder/frontend

# Build and push frontend image
gcloud builds submit --tag us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/frontend:latest

# Deploy to Cloud Run
gcloud run deploy portfolio-frontend \
  --image us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080
```

**Note the frontend URL from the output!**

## Step 7: Update Backend CORS_ORIGIN

```bash
# Get the frontend URL from previous step
export FRONTEND_URL="https://portfolio-frontend-XXXXX.run.app"

# Update backend with correct CORS origin
gcloud run services update portfolio-backend \
  --region $REGION \
  --update-env-vars "CORS_ORIGIN=$FRONTEND_URL"
```

## Step 8: Test Login

1. Open frontend URL in browser
2. Go to `/login`
3. Login with:
   - Email: admin@pasuai.online
   - Password: PasuAI@2026

## Step 9: Setup Custom Domain (Optional)

Follow the guide in `CUSTOM_DOMAIN_SETUP.md` to map `portfoliobuilder.pasuai.online` to your frontend service.

---

## Quick Commands (Copy-Paste All at Once)

```bash
# Set variables
export PROJECT_ID=$(gcloud config get-value project)
export REGION=us-central1

# Create repository
gcloud artifacts repositories create portfolio-repo \
  --repository-format=docker \
  --location=us \
  --description="Portfolio Builder Docker Repository"

# Configure Docker
gcloud auth configure-docker us-docker.pkg.dev

# Deploy backend
cd ~/Portfolio-Builder/backend
gcloud builds submit --tag us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/backend:latest
gcloud run deploy portfolio-backend \
  --image us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,MONGODB_URI=mongodb+srv://erpawan459_db_user:alhFC6pCako72e3n@helpdesk-cluster.hlw9wff.mongodb.net/portfoliobuilder,JWT_SECRET=your-super-secret-jwt-key-change-this-in-production,JWT_EXPIRES_IN=7d,CORS_ORIGIN=https://placeholder.run.app"

echo "✅ Backend deployed! Copy the URL above and update frontend/Dockerfile"
```

After backend is deployed, update `frontend/Dockerfile` with the backend URL, then:

```bash
# Deploy frontend
cd ~/Portfolio-Builder/frontend
gcloud builds submit --tag us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/frontend:latest
gcloud run deploy portfolio-frontend \
  --image us-docker.pkg.dev/$PROJECT_ID/portfolio-repo/frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

echo "✅ Frontend deployed! Copy the URL above"
```

Finally, update backend CORS:

```bash
# Replace with your actual frontend URL
export FRONTEND_URL="https://portfolio-frontend-XXXXX.run.app"

gcloud run services update portfolio-backend \
  --region $REGION \
  --update-env-vars "CORS_ORIGIN=$FRONTEND_URL"

echo "✅ Deployment complete!"
echo "Frontend: $FRONTEND_URL"
echo "Login: admin@pasuai.online / PasuAI@2026"
```
