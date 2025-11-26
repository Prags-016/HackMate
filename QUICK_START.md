# 🚀 Quick Start - Get Running in 15 Minutes

## Current Status ✅
- ✅ Node.js installed (v22.20.0)
- ✅ npm installed (10.9.3)
- ✅ Dependencies downloaded
- ✅ .env files created
- ❌ **API Keys needed** - This is what's blocking you!

---

## ⚡ Fast Track Setup (3 Services)

### Step 1: MongoDB (5 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create cluster → Choose FREE tier
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your password
7. **Paste into:** `slack-clone/backend/.env` → Replace `MONGO_URI=your_mongo_uri_here`

### Step 2: Clerk (3 minutes)
1. Go to: https://clerk.com
2. Sign up (free)
3. Create application
4. Go to "API Keys"
5. Copy **Publishable Key** and **Secret Key**
6. **Update files:**
   - `slack-clone/backend/.env`: Replace both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   - `slack-clone/frontend/.env`: Replace `VITE_CLERK_PUBLISHABLE_KEY`

### Step 3: Stream (3 minutes)
1. Go to: https://getstream.io
2. Sign up (free)
3. Create app → Choose "Chat"
4. Go to "Chat" → "API Keys"
5. Copy **API Key** and **API Secret**
6. **Update files:**
   - `slack-clone/backend/.env`: Replace `STREAM_API_KEY` and `STREAM_API_SECRET`
   - `slack-clone/frontend/.env`: Replace `VITE_STREAM_API_KEY`

---

## 🎯 Run It!

After you have all 3 API keys set up:

**Terminal 1 - Backend:**
```powershell
cd slack-clone\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd slack-clone\frontend
npm run dev
```

Then open: **http://localhost:5173** in Chrome! 🎉

---

## ⚠️ What Happens If You Try Now?

If you try to run without API keys:
- ❌ **Frontend will crash** - "Missing Publishable Key" error
- ❌ **Backend will exit** - MongoDB connection error

**You MUST replace the placeholder values first!**

---

## 💡 Need Help?

1. Open `SETUP_GUIDE.md` for detailed instructions
2. Open `REQUIREMENTS.md` for complete checklist
3. All services have free tiers - no credit card needed!

