# Custom Domain Setup with Google Cloud Load Balancer

## Prerequisites
- Domain: pasuai.online (verified in Google Cloud)
- Cloud Run services deployed in asia-south1

## Step 1: Create Serverless NEG (Network Endpoint Group)

### For Frontend
```bash
gcloud compute network-endpoint-groups create portfolio-frontend-neg \
    --region=asia-south1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=portfolio-frontend
```

### For Backend
```bash
gcloud compute network-endpoint-groups create portfolio-backend-neg \
    --region=asia-south1 \
    --network-endpoint-type=serverless \
    --cloud-run-service=portfolio-backend
```

## Step 2: Reserve Static IP Address

```bash
gcloud compute addresses create portfolio-ip \
    --ip-version=IPV4 \
    --global

# Get the IP address
gcloud compute addresses describe portfolio-ip \
    --format="get(address)" \
    --global
```

**Note the IP address** - you'll need it for DNS configuration.

## Step 3: Create Backend Services

### Frontend Backend Service
```bash
gcloud compute backend-services create portfolio-frontend-backend \
    --global

gcloud compute backend-services add-backend portfolio-frontend-backend \
    --global \
    --network-endpoint-group=portfolio-frontend-neg \
    --network-endpoint-group-region=asia-south1
```

### Backend API Backend Service
```bash
gcloud compute backend-services create portfolio-backend-backend \
    --global

gcloud compute backend-services add-backend portfolio-backend-backend \
    --global \
    --network-endpoint-group=portfolio-backend-neg \
    --network-endpoint-group-region=asia-south1
```

## Step 4: Create URL Map

```bash
gcloud compute url-maps create portfolio-lb \
    --default-service=portfolio-frontend-backend
```

### Add path matcher for backend API
```bash
gcloud compute url-maps add-path-matcher portfolio-lb \
    --default-service=portfolio-frontend-backend \
    --path-matcher-name=portfolio-matcher \
    --path-rules="/api/*=portfolio-backend-backend"
```

## Step 5: Create SSL Certificate

### Option A: Google-managed SSL (Recommended)
```bash
gcloud compute ssl-certificates create portfolio-ssl \
    --domains=portfoliobuilder.pasuai.online \
    --global
```

### Option B: Self-managed SSL (if you have your own certificate)
```bash
gcloud compute ssl-certificates create portfolio-ssl \
    --certificate=path/to/cert.pem \
    --private-key=path/to/key.pem \
    --global
```

## Step 6: Create HTTPS Target Proxy

```bash
gcloud compute target-https-proxies create portfolio-https-proxy \
    --ssl-certificates=portfolio-ssl \
    --url-map=portfolio-lb
```

## Step 7: Create Forwarding Rule

```bash
gcloud compute forwarding-rules create portfolio-https-rule \
    --address=portfolio-ip \
    --target-https-proxy=portfolio-https-proxy \
    --global \
    --ports=443
```

### Optional: HTTP to HTTPS redirect
```bash
gcloud compute url-maps import portfolio-lb \
    --source=/dev/stdin <<EOF
name: portfolio-lb
defaultService: https://www.googleapis.com/compute/v1/projects/project-df5557df-0863-4f74-a10/global/backendServices/portfolio-frontend-backend
hostRules:
- hosts:
  - portfoliobuilder.pasuai.online
  pathMatcher: portfolio-matcher
pathMatchers:
- name: portfolio-matcher
  defaultService: https://www.googleapis.com/compute/v1/projects/project-df5557df-0863-4f74-a10/global/backendServices/portfolio-frontend-backend
  pathRules:
  - paths:
    - /api/*
    service: https://www.googleapis.com/compute/v1/projects/project-df5557df-0863-4f74-a10/global/backendServices/portfolio-backend-backend
EOF
```

## Step 8: Configure DNS

Go to your domain registrar (where you bought pasuai.online) and add these DNS records:

### A Record
```
Type: A
Name: portfoliobuilder
Value: <STATIC_IP_FROM_STEP_2>
TTL: 3600
```

### Example for Cloudflare/GoDaddy/Namecheap:
```
A    portfoliobuilder    <YOUR_STATIC_IP>    Automatic
```

## Step 9: Wait for SSL Certificate Provisioning

Check SSL certificate status:
```bash
gcloud compute ssl-certificates describe portfolio-ssl \
    --global \
    --format="get(managed.status)"
```

**Status should be:** `ACTIVE`

This can take 15-60 minutes. Google needs to verify domain ownership.

## Step 10: Update Backend CORS

Update backend environment variable:
```bash
gcloud run services update portfolio-backend \
    --region asia-south1 \
    --update-env-vars "CORS_ORIGIN=https://portfoliobuilder.pasuai.online"
```

## Step 11: Test Your Setup

1. Wait for DNS propagation (5-30 minutes)
2. Visit: https://portfoliobuilder.pasuai.online
3. Login with: admin@pasuai.online / PasuAI@2026

## Troubleshooting

### Check Load Balancer Status
```bash
gcloud compute forwarding-rules describe portfolio-https-rule --global
```

### Check SSL Certificate Status
```bash
gcloud compute ssl-certificates describe portfolio-ssl --global
```

### Check Backend Health
```bash
gcloud compute backend-services get-health portfolio-frontend-backend --global
gcloud compute backend-services get-health portfolio-backend-backend --global
```

### Common Issues

**SSL Certificate stuck in PROVISIONING:**
- Verify DNS A record points to correct IP
- Wait up to 60 minutes
- Check domain ownership in Google Search Console

**502 Bad Gateway:**
- Check Cloud Run services are running
- Verify NEG configuration
- Check backend service health

**CORS errors:**
- Update CORS_ORIGIN environment variable
- Restart backend service

## Cost Estimate

- Load Balancer: ~$18/month
- Static IP: ~$3/month (when not in use)
- SSL Certificate: Free (Google-managed)
- Total: ~$21/month + traffic costs

## Alternative: Simple Setup (No Load Balancer)

If you want to avoid Load Balancer costs, you can:
1. Use Cloud Run URLs directly
2. Set up Cloudflare as reverse proxy (free)
3. Point your domain to Cloudflare
4. Configure Cloudflare to proxy to Cloud Run URLs

---

**Need Help?** 
- Google Cloud Load Balancer Docs: https://cloud.google.com/load-balancing/docs
- Cloud Run Custom Domains: https://cloud.google.com/run/docs/mapping-custom-domains
