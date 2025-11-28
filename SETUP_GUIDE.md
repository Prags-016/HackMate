# 🔑 Complete Setup Guide

This guide will help you set up everything needed to run the Slack Clone application.

## ⚙️ System Requirements

### Prerequisites
- **Node.js**: Version 18.17.0 or higher (required by Clerk and other dependencies)
  - Check your version: `node --version`
  - Download: https://nodejs.org/
- **npm**: Comes with Node.js (check: `npm --version`)
- **Ports Available**: 
  - Port `5001` for backend (or change `PORT` in backend `.env`)
  - Port `5173` for frontend (Vite default)
- **Internet Connection**: Required for API services and database

---

## 📋 Required Services (Minimum to Run)

### 1. **MongoDB** (Database) - REQUIRED
**Why:** Stores user data and application information

**Steps:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (choose the FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
6. Replace `<password>` with your database password
7. Add this to `backend/.env` as `MONGO_URI`

**Time:** ~5 minutes

---

### 2. **Clerk** (Authentication) - REQUIRED
**Why:** Handles user login and authentication

**Steps:**
1. Go to https://clerk.com and sign up (free tier available)
2. Create a new application
3. Go to "API Keys" in the dashboard
4. Copy:
   - **Publishable Key** → `CLERK_PUBLISHABLE_KEY` (backend & frontend)
   - **Secret Key** → `CLERK_SECRET_KEY` (backend only)
5. Update both `.env` files:
   - `backend/.env`: Add both keys
   - `frontend/.env`: Add `VITE_CLERK_PUBLISHABLE_KEY`

**⚠️ Important:** The frontend will throw an error if `VITE_CLERK_PUBLISHABLE_KEY` is missing!

**Webhook Configuration (For Inngest - Optional but Recommended):**
- Go to Clerk Dashboard → "Webhooks"
- Add endpoint: `http://localhost:5001/api/inngest` (for local development)
- Subscribe to events: `user.created` and `user.deleted`
- This enables automatic user sync when users sign up/delete accounts
- **Note:** For production, you'll need to use Inngest Cloud or configure webhooks properly

**Time:** ~5 minutes (including webhook setup)

---

### 3. **Stream** (Chat & Video) - REQUIRED
**Why:** Powers real-time chat and video calling features

**Steps:**
1. Go to https://getstream.io and sign up (free tier available)
2. Create a new app
3. Go to "Chat" → "API Keys"
4. Copy:
   - **API Key** → `STREAM_API_KEY` (backend & frontend)
   - **API Secret** → `STREAM_API_SECRET` (backend only)
5. Update both `.env` files:
   - `backend/.env`: Add both keys
   - `frontend/.env`: Add `VITE_STREAM_API_KEY`

**Time:** ~3 minutes

---

## 🔧 Optional Services

### 4. **Sentry** (Error Monitoring) - OPTIONAL
**Why:** Tracks errors in production (can be skipped for development)

**Steps:**
1. Go to https://sentry.io/signup/
2. Create a project
3. Copy the DSN
4. Add to both `.env` files as `SENTRY_DSN` / `VITE_SENTRY_DSN`

**Note:** You can leave this as `your_sentry_dsn_here` for now if you want to skip it.

---

### 5. **Inngest** (Background Jobs) - OPTIONAL
**Why:** Handles automatic user synchronization when users sign up or delete accounts

**Steps:**
1. Go to https://www.inngest.com
2. Sign up and create an app
3. Get your event key and signing key
4. Add to `backend/.env`:
   - `INNGEST_EVENT_KEY=your_key_here`
   - `INNGEST_SIGNING_KEY=your_key_here`

**Note:** 
- Without Inngest, user accounts won't automatically sync to MongoDB/Stream when created via Clerk
- You can manually create users, but automatic sync requires Inngest + Clerk webhooks
- For local development, you can use Inngest Dev Server or skip it initially

---

## ✅ Complete Setup Checklist

### System Requirements
- [ ] Node.js 18.17.0+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Ports 5001 and 5173 available

### API Keys & Services
- [ ] MongoDB account created and connection string added to `backend/.env`
- [ ] Clerk account created and keys added:
  - [ ] `CLERK_PUBLISHABLE_KEY` in `backend/.env`
  - [ ] `CLERK_SECRET_KEY` in `backend/.env`
  - [ ] `VITE_CLERK_PUBLISHABLE_KEY` in `frontend/.env`
- [ ] Stream account created and keys added:
  - [ ] `STREAM_API_KEY` in `backend/.env`
  - [ ] `STREAM_API_SECRET` in `backend/.env`
  - [ ] `VITE_STREAM_API_KEY` in `frontend/.env`
- [ ] All `.env` files updated with real values (no placeholders)

### Optional (Recommended)
- [ ] Clerk webhooks configured for user events (if using Inngest)
- [ ] Inngest account created and keys added (for automatic user sync)
- [ ] Sentry account created (for error monitoring)

---

## 🚀 After Setup

Once you have the minimum required keys (MongoDB, Clerk, Stream), you can run:

```bash
# Terminal 1 - Backend
cd HackMate\backend
npm run dev

# Terminal 2 - Frontend  
cd HackMate\frontend
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## 💡 Important Notes & Tips

### Critical Requirements
- **Frontend will crash** if `VITE_CLERK_PUBLISHABLE_KEY` is missing or invalid
- **Backend requires MongoDB** - the server will exit if connection fails
- **Stream keys are required** for chat functionality to work

### Development Tips
- All three required services offer free tiers that are perfect for development
- You can start with just the required services and add optional ones later
- Make sure to never commit your `.env` files to git (they should be in `.gitignore`)
- For local Inngest development, you can use `npx inngest-cli dev` to run a local server

### Troubleshooting
- **"Missing Publishable Key" error**: Check `frontend/.env` has `VITE_CLERK_PUBLISHABLE_KEY`
- **MongoDB connection errors**: Verify your connection string and network access
- **Port already in use**: Change `PORT` in `backend/.env` or kill the process using the port
- **CORS errors**: Ensure `CLIENT_URL` in backend matches your frontend URL

### Database Notes
- MongoDB collections are created automatically on first use
- No manual database migrations needed
- User model will be created when first user signs up (if Inngest is configured)


