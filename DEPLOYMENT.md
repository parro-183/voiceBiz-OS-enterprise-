# Complete voiceBiz-OS-enterprise Setup Guide

## Quick Start

### Backend Setup
```bash
cd voiceBiz-OS-enterprise
npm install
npm run dev
```
Server runs on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Dashboard runs on `http://localhost:5173`

---

## 🎯 Features

### 1. 📱 Web Dashboard
- Real-time call management
- Agent status tracking
- Live analytics & metrics
- Sentiment analysis visualization

### 2. 📞 Real Twilio Integration
```bash
npm install twilio
# Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env
```

### 3. 🔄 WebSocket Real-time
- Live call streaming
- Agent status updates
- Real-time analytics

### 4. 💾 PostgreSQL Database
```bash
# Install PostgreSQL
# Update DATABASE_URL in .env
npm install pg
```

### 5. 📧 Email Notifications
- Call alerts
- Agent notifications
- System alerts

### 6. 🔐 Advanced Security
- Rate limiting
- Encryption
- JWT authentication

### 7. ☁️ Cloud Deployment
- Google Cloud App Engine
- Heroku
- AWS

---

## Deployment

### Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Google Cloud
```bash
gcloud app deploy
```

### AWS
```bash
aws eb create voicebiz-env
aws eb deploy
```

---

## API Documentation

See `docs/API.md` for complete endpoint documentation.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

---

## Support

For issues, create a GitHub issue: https://github.com/parro-183/voiceBiz-OS-enterprise-/issues
