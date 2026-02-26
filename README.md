# Feedbin Proxy

Simple proxy service for Feedbin API with Bearer token authentication.

## Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variable: `vercel env add AUTH_TOKEN`

## Deploy to Railway

1. Connect GitHub repo to Railway
2. Add environment variable `AUTH_TOKEN`

## Deploy to Render

1. Create new Web Service
2. Connect GitHub repo
3. Add environment variable `AUTH_TOKEN`

## Usage

```
GET https://your-proxy.vercel.app/feedbin/entries.json
Headers:
  Authorization: Bearer YOUR_AUTH_TOKEN
  X-Feedbin-Auth: your-email@example.com:your-password
```

## Environment Variables

- `AUTH_TOKEN` - Secret token to protect the proxy
- `PORT` - Server port (default: 3000)