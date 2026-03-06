# AmakaSole

**Custom orthotic insoles for luxury footwear powered by 3D scanning and AI**

A cross-platform MVP (iOS & Android) that uses 3D foot scanning, gait analysis, and AI to generate custom orthotic insoles.

---

## 🏗️ Project Structure

```
amakasole/
├── packages/
│   ├── db/               # Drizzle ORM + Neon PostgreSQL
│   ├── shared/           # Shared types, Zod schemas, constants
│   └── api/              # Express REST API
├── apps/
│   ├── mobile/           # React Native + Expo (TODO)
│   └── web-dashboard/    # Next.js dashboard (TODO)
├── amakasole.code-workspace  # VS Code workspace
├── Makefile
└── README.md
```

---

## ✅ What's Been Built

### 1. **Database Layer** (`packages/db`)
- ✅ Complete Drizzle ORM schema (all tables and relations)
- ✅ Neon PostgreSQL integration (serverless, free tier)
- ✅ Migration system
- ✅ Comprehensive seed data with test accounts

**Models:**
- Users, UserProfiles, RefreshTokens
- FootScans, GaitAnalyses
- OrthoticDesigns
- Orders, Subscriptions
- BrandPartners, BrandPartnerOrders

### 2. **Shared Package** (`packages/shared`)
- ✅ All TypeScript interfaces
- ✅ Complete Zod validation schemas (auth, scans, orthotics, orders)
- ✅ Shared constants (pricing, limits, etc.)
- ✅ API request/response types

### 3. **API Backend** (`packages/api`)
- ✅ Express server with security (Helmet, CORS, rate limiting)
- ✅ JWT authentication (access + refresh tokens)
- ✅ Complete auth routes (register, login, logout, refresh, /me)
- ✅ Middleware (auth, validation, error handling)
- ✅ S3/DigitalOcean Spaces integration for file uploads
- ⏳ TODO: Scan, gait, orthotic, order, partner routes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (via Neon - free tier)

### 1. Clone & Install

```bash
cd AmakaSoleApp
make setup
```

### 2. Set Up Neon Database

1. Go to [https://console.neon.tech/](https://console.neon.tech/)
2. Create a new project (free tier)
3. Copy your connection string
4. Create `.env` in project root:

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/amakasole?sslmode=require"
```

### 3. Run Migrations & Seed

```bash
make migrate
make seed
```

### 4. Start Development Server

```bash
make dev
```

API runs on [http://localhost:3000](http://localhost:3000)

---

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "consumer@amakasole.com",
    "password": "Password123!"
  }'
```

Response includes `accessToken` - use it in subsequent requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/auth/me
```

---

## 👤 Test Accounts

After running `make seed`:

- **Consumer:** `consumer@amakasole.com` / `Password123!`
- **Brand Partner:** `brand@luxebrand.com` / `Password123!`
- **Admin:** `admin@amakasole.com` / `Password123!`

---

## 📦 Available Commands

```bash
make setup    # Initial project setup
make dev      # Start development server
make build    # Build all packages
make test     # Run tests
make migrate  # Run database migrations
make seed     # Seed test data
make clean    # Remove node_modules and build artifacts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | Neon PostgreSQL (serverless) + Drizzle ORM |
| **API** | Express + TypeScript |
| **Auth** | JWT (access + refresh tokens) |
| **Validation** | Zod schemas |
| **File Storage** | DigitalOcean Spaces (S3-compatible) |
| **Payments** | Stripe |
| **Queue** | Bull (Redis-backed) |
| **Mobile** | React Native + Expo (TODO) |
| **Web** | Next.js 14 (TODO) |

---

## 📋 Next Steps

### Immediate (Finish MVP Backend):
1. ✅ Complete remaining API routes:
   - `/api/scans/*` - Upload scans, check status
   - `/api/orthotics/*` - Generate designs
   - `/api/orders/*` - Stripe integration
2. ✅ Build Bull queue jobs for async processing
3. ✅ Add Stripe webhook handling

### Phase 2 (ML Service):
4. ✅ FastAPI Python service
5. ✅ Scan processing (Open3D)
6. ✅ Gait analysis (MediaPipe)
7. ✅ Orthotic generation logic

### Phase 3 (Mobile App):
8. ✅ React Native + Expo setup
9. ✅ Design system (NativeWind + custom components)
10. ✅ Key screens (Onboarding, Scan, Results, Checkout)
11. ✅ React Query integration

### Phase 4 (Deployment):
12. ✅ DigitalOcean App Platform deployment
13. ✅ CI/CD with GitHub Actions
14. ✅ Production environment variables

---

## 🤝 Contributing

This is an MVP build. To continue development:

1. Check `IMPLEMENTATION_STATUS.md` for current progress
2. Follow the patterns established in existing code
3. All new routes should follow the auth routes pattern
4. Use Zod schemas for all request validation
5. Return `ApiResponse<T>` format for all endpoints

---

## 📄 License

Proprietary - All Rights Reserved

---

## 💡 Architecture Notes

- **Monorepo:** Uses npm workspaces
- **Type Safety:** Shared types prevent API/frontend drift
- **Serverless Ready:** Neon DB works great with Vercel/DO App Platform
- **Extensible:** Add new routes by following existing patterns

---

**Built with ❤️ using Claude Code**
