# 📋 Complete Requirements List

## ✅ System Requirements

1. **Node.js** 
   - Version: **18.17.0 or higher** (required)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **npm** (comes with Node.js)
   - Check: `npm --version`

3. **Available Ports**
   - Port **5001** for backend server
   - Port **5173** for frontend dev server (Vite default)

4. **Internet Connection**
   - Required for API services and database access

---

## 🔑 Required API Keys & Services

### 1. MongoDB (Database) - **REQUIRED**
- **What:** Cloud database to store user data
- **Free Tier:** Yes (M0 Free Cluster)
- **Get it:** https://www.mongodb.com/cloud/atlas/register
- **Needed in:** `backend/.env` as `MONGO_URI`
- **Critical:** Backend will exit if MongoDB connection fails

### 2. Clerk (Authentication) - **REQUIRED**
- **What:** User authentication and login system
- **Free Tier:** Yes
- **Get it:** https://clerk.com
- **Needed in:**
  - `backend/.env`: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - `frontend/.env`: `VITE_CLERK_PUBLISHABLE_KEY`
- **Critical:** Frontend will crash if `VITE_CLERK_PUBLISHABLE_KEY` is missing

### 3. Stream (Chat & Video) - **REQUIRED**
- **What:** Real-time chat and video calling
- **Free Tier:** Yes (limited usage)
- **Get it:** https://getstream.io
- **Needed in:**
  - `backend/.env`: `STREAM_API_KEY`, `STREAM_API_SECRET`
  - `frontend/.env`: `VITE_STREAM_API_KEY`
- **Critical:** Chat features won't work without these

---

## 🔧 Optional Services (Recommended)

### 4. Inngest (Background Jobs) - **OPTIONAL**
- **What:** Handles automatic user sync when users sign up/delete
- **Free Tier:** Yes
- **Get it:** https://www.inngest.com
- **Needed in:** `backend/.env`: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- **Note:** Without this, users won't auto-sync to database on signup

### 5. Sentry (Error Monitoring) - **OPTIONAL**
- **What:** Tracks and reports application errors
- **Free Tier:** Yes
- **Get it:** https://sentry.io
- **Needed in:**
  - `backend/.env`: `SENTRY_DSN`
  - `frontend/.env`: `VITE_SENTRY_DSN`
- **Note:** Can be skipped for development

---

## 🔗 Additional Configuration

### Clerk Webhooks (If using Inngest)
- **Purpose:** Automatically sync users when they sign up or delete accounts
- **Setup:** 
  - Clerk Dashboard → Webhooks
  - Endpoint: `http://localhost:5001/api/inngest` (local) or your production URL
  - Events: `user.created`, `user.deleted`
- **Note:** Only needed if you want automatic user synchronization

---

## 📝 Environment Variables Summary

### Backend (`slack-clone/backend/.env`)
```
PORT=5001
MONGO_URI=your_mongo_uri_here          # REQUIRED
NODE_ENV=development
CLERK_PUBLISHABLE_KEY=...               # REQUIRED
CLERK_SECRET_KEY=...                    # REQUIRED
STREAM_API_KEY=...                      # REQUIRED
STREAM_API_SECRET=...                   # REQUIRED
SENTRY_DSN=...                          # Optional
INNGEST_EVENT_KEY=...                   # Optional
INNGEST_SIGNING_KEY=...                 # Optional
CLIENT_URL=http://localhost:5173
```

### Frontend (`slack-clone/frontend/.env`)
```
VITE_CLERK_PUBLISHABLE_KEY=...         # REQUIRED
VITE_STREAM_API_KEY=...                 # REQUIRED
VITE_SENTRY_DSN=...                     # Optional
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## ⚠️ Critical Notes

1. **Frontend will crash** if `VITE_CLERK_PUBLISHABLE_KEY` is missing
2. **Backend will exit** if MongoDB connection fails
3. **Chat won't work** without Stream API keys
4. **Node.js 18.17.0+** is required (Clerk dependency)
5. **Ports must be available** - change ports in `.env` if needed

---

## 🚀 Minimum to Run

To get the app running with basic functionality, you need:
- ✅ Node.js 18.17.0+
- ✅ MongoDB connection string
- ✅ Clerk publishable & secret keys
- ✅ Stream API key & secret

Everything else is optional but recommended for full functionality.

