# Complete Custom Domain Setup Guide
## portfoliobuilder.pasuai.online

## Step 1: Map Domain in Google Cloud Run

Run this command in Google Cloud Shell:

```bash
gcloud run domain-mappings create \
  --service portfolio-frontend \
  --domain portfoliobuilder.pasuai.online \
  --region us-central1
```

**Output will show DNS records like:**
```
Please add the following DNS records to your domain:

Type: A
Name: portfoliobuilder
Value: 216.239.32.21
       216.239.34.21
       216.239.36.21
       216.239.38.21

Type: AAAA
Name: portfoliobuilder
Value: 2001:4860:4802:32::15
       2001:4860:4802:34::15
       2001:4860:4802:36::15
       2001:4860:4802:38::15
```

**IMPORTANT:** Copy these exact values from your output!

## Step 2: Add DNS Records to Domain Provider

Go to your domain provider (where you bought pasuai.online) and add these records:

### A Records (IPv4):
```
Type: A
Host/Name: portfoliobuilder
Value/Points to: 216.239.32.21
TTL: 3600 (or Auto)

Type: A
Host/Name: portfoliobuilder
Value/Points to: 216.239.34.21
TTL: 3600

Type: A
Host/Name: portfoliobuilder
Value/Points to: 216.239.36.21
TTL: 3600

Type: A
Host/Name: portfoliobuilder
Value/Points to: 216.239.38.21
TTL: 3600
```

### AAAA Records (IPv6):
```
Type: AAAA
Host/Name: portfoliobuilder
Value/Points to: 2001:4860:4802:32::15
TTL: 3600

Type: AAAA
Host/Name: portfoliobuilder
Value/Points to: 2001:4860:4802:34::15
TTL: 3600

Type: AAAA
Host/Name: portfoliobuilder
Value/Points to: 2001:4860:4802:36::15
TTL: 3600

Type: AAAA
Host/Name: portfoliobuilder
Value/Points to: 2001:4860:4802:38::15
TTL: 3600
```

## Step 3: Wait for DNS Propagation

DNS propagation can take 5 minutes to 48 hours. Usually it's done in 15-30 minutes.

Check status:
```bash
# Check A records
nslookup portfoliobuilder.pasuai.online

# Check domain mapping status
gcloud run domain-mappings describe \
  --domain portfoliobuilder.pasuai.online \
  --region us-central1
```

## Step 4: Verify SSL Certificate

Google Cloud Run automatically provisions SSL certificate. Check status:

```bash
gcloud run domain-mappings describe \
  --domain portfoliobuilder.pasuai.online \
  --region us-central1 \
  --format="value(status.certificateStatus)"
```

Status should show: `ACTIVE`

## Step 5: Update Google Search Console

1. Go to: https://search.google.com/search-console
2. Click "Add Property"
3. Enter: `https://portfoliobuilder.pasuai.online`
4. Verify ownership (DNS TXT record method)
5. Submit sitemap: `https://portfoliobuilder.pasuai.online/sitemap.xml`

### DNS Verification (Recommended):
Google will give you a TXT record like:
```
Type: TXT
Host/Name: portfoliobuilder (or @)
Value: google-site-verification=XXXXXXXXXXXXX
TTL: 3600
```

Add this to your DNS records.

## Step 6: Test Your Domain

After DNS propagation:

```bash
# Test homepage
curl -I https://portfoliobuilder.pasuai.online/

# Test robots.txt
curl https://portfoliobuilder.pasuai.online/robots.txt

# Test sitemap
curl https://portfoliobuilder.pasuai.online/sitemap.xml

# Test in browser
# Open: https://portfoliobuilder.pasuai.online
```

## Step 7: Update Backend CORS (If Needed)

If you face CORS issues, update backend:

```bash
gcloud run services update portfolio-backend \
  --region us-central1 \
  --update-env-vars "CORS_ORIGIN=https://portfoliobuilder.pasuai.online"
```

## Common DNS Providers Setup

### Cloudflare:
1. Go to DNS settings
2. Add A and AAAA records
3. Set Proxy status to "DNS only" (grey cloud)
4. Wait for propagation

### GoDaddy:
1. Go to DNS Management
2. Add A records (4 entries)
3. Add AAAA records (4 entries)
4. Save changes

### Namecheap:
1. Go to Advanced DNS
2. Add A records
3. Add AAAA records
4. Save all changes

### Google Domains:
1. Go to DNS settings
2. Add custom resource records
3. Add all A and AAAA records
4. Save

## Troubleshooting

### Issue: Domain not resolving
**Solution:** Wait longer (up to 48 hours) or check DNS records are correct

### Issue: SSL certificate pending
**Solution:** Wait 15-30 minutes after DNS propagation

### Issue: 404 errors
**Solution:** Verify domain mapping is active:
```bash
gcloud run domain-mappings list --region us-central1
```

### Issue: CORS errors
**Solution:** Update backend CORS_ORIGIN environment variable

## Verification Checklist

- [ ] Domain mapping created in Cloud Run
- [ ] DNS A records added (4 records)
- [ ] DNS AAAA records added (4 records)
- [ ] DNS propagation complete (15-30 min)
- [ ] SSL certificate active
- [ ] Domain accessible via HTTPS
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google
- [ ] Backend CORS updated (if needed)

## Current URLs

### Before Custom Domain:
- Frontend: https://portfolio-frontend-1095465864763.us-central1.run.app
- Backend: https://portfolio-backend-1095465864763.us-central1.run.app

### After Custom Domain:
- Frontend: https://portfoliobuilder.pasuai.online
- Backend: https://portfolio-backend-1095465864763.us-central1.run.app (stays same)

## Cost

Custom domain mapping on Cloud Run is **FREE**!
- No additional charges
- Free SSL certificate
- No bandwidth charges for domain mapping

## Support

If you need help:
- Email: admin@pasuai.online
- Phone: +91 9795635252

---

**Note:** Keep the Cloud Run URL as backup. You can access the site from both URLs after domain mapping.
