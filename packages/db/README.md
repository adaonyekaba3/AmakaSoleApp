# @amakasole/db

Database package for AmakaSole using Drizzle ORM and Neon PostgreSQL.

## Setup

### 1. Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project (free tier includes 3GB storage)
3. Copy your connection string
4. Create `.env` file in this directory:

```bash
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/amakasole?sslmode=require"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate and Run Migrations

```bash
# Generate migration files from schema
npm run generate

# Apply migrations to database
npm run migrate
```

### 4. Seed Database

```bash
npm run seed
```

## Development

### Drizzle Studio (Database GUI)

View and edit your database visually:

```bash
npm run studio
```

This opens a web UI at `https://local.drizzle.studio`

### Push Schema Changes (Dev Only)

For rapid prototyping, push schema changes directly without migrations:

```bash
npm run push
```

⚠️ **Warning:** This is destructive and should only be used in development.

## Usage in Other Packages

```typescript
import { db, users, footScans } from '@amakasole/db';
import { eq } from 'drizzle-orm';

// Query users
const allUsers = await db.select().from(users);

// Query with relations
const userWithProfile = await db.query.users.findFirst({
  where: eq(users.email, 'consumer@amakasole.com'),
  with: {
    profile: true,
    scans: true,
  },
});

// Insert data
const [newUser] = await db
  .insert(users)
  .values({
    email: 'new@example.com',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'hashed_password',
  })
  .returning();
```

## Test Accounts

After seeding, use these accounts for testing:

- **Consumer:** `consumer@amakasole.com` / `Password123!`
- **Brand Partner:** `brand@luxebrand.com` / `Password123!`
- **Admin:** `admin@amakasole.com` / `Password123!`

## Connecting to Neon from Vercel

Neon integrates seamlessly with Vercel:

1. In Vercel project settings → Integrations → Add Neon
2. Or manually add `DATABASE_URL` environment variable
3. Neon automatically scales with serverless functions

## Schema Overview

- `users` - User accounts and authentication
- `user_profiles` - Extended user information
- `refresh_tokens` - JWT refresh tokens
- `foot_scans` - 3D foot scan data
- `gait_analyses` - Gait analysis results
- `orthotic_designs` - Custom insole designs
- `orders` - Order management
- `subscriptions` - User subscriptions
- `brand_partners` - Brand partner accounts
- `brand_partner_orders` - Brand partner order tracking
