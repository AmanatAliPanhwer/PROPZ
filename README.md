# PROPZ (THANK Platform)

> **A platform that turns gratitude into visible reputation and, eventually, into real economic value for workers.**

Neo Brutalist MVP for public worker appreciation. Users send "Thanks" to workers (colleagues, employees). Each Thank has a note, optional tags, images, and a verified badge.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma ORM v7 |
| Auth | Supabase Auth (Email/Password + Google OAuth) |
| Storage | Supabase Storage (images) |
| Font | Space Grotesk (via next/font) |
| Icons | react-icons (FiCamera) |
| Smart Contracts | Solidity 0.8.28 (Hardhat, OpenZeppelin) |
| Blockchain | Polygon Amoy testnet (viem, wagmi, RainbowKit) |

---

## Architecture

```
src/
├── app/                          # App Router pages & API routes
│   ├── layout.tsx                # Root layout (Header + main)
│   ├── page.tsx                  # Home — global feed (infinite scroll)
│   ├── loading.tsx               # Root loading state
│   ├── error.tsx                 # Root error boundary
│   ├── not-found.tsx             # 404 page
│   ├── globals.css               # Tailwind + Neo Brutalist utilities
│   ├── dashboard/                # User stats, recent activity, worker grid
│   ├── profile/[id]/             # Worker profile with received Thanks
│   ├── thank/new/                # Create Thank form with image upload
│   ├── workers/                  # Worker browse + search
│   ├── verify/                   # Verification request form
│   ├── admin/                    # Admin: moderation + verification review
│   ├── login/                    # Sign in
│   ├── register/                 # Sign up
│   ├── onboarding/              # Post-registration profile setup
│   ├── suspended/               # Suspended user notice
│   ├── auth/callback/           # OAuth callback handler
│   └── api/                      # REST API routes
│       ├── thanks/               # GET /api/thanks (cursor pagination)
│       └── auth/                 # me, sync-user
├── components/
│   ├── layout/                   # Header
│   ├── ui/                       # Button, Card, Input, Textarea, Skeleton, ErrorCard
│   ├── features/                 # ThankCard, ThankList, ThankForm, StatsCard,
│   │                             # StatsCardSkeleton, ThankCardSkeleton,
│   │                             # DashboardProfile, ImageViewer, InlineSearch,
│   │                             # ReportModal, VerificationBadge
│   └── auth/                     # LoginForm, RegisterForm, OnboardingForm
├── lib/
│   ├── prisma.ts                 # PrismaClient singleton (PostgreSQL adapter)
│   ├── queries.ts                # DB query helpers
│   ├── actions.ts                # Server Actions (createThank, etc.)
│   ├── rate-limit.ts             # IP-based sliding window rate limiter
│   └── supabase/                 # Client, server, admin Supabase clients
├── proxy.ts                      # Supabase Auth SSR proxy
├── lib/blockchain/               # viem clients, reward logic, contract ABIs
├── components/providers/         # Web3Provider (wagmi + RainbowKit)
└── generated/prisma/             # Prisma client output (gitignored)

blockchain/
├── contracts/                    # Solidity source (THANKToken, ThankReward)
├── test/                         # Hardhat tests (17 passing)
├── scripts/                      # Deploy + verify scripts
├── hardhat.config.ts
└── artifacts/                    # Compiled ABIs (gitignored)

prisma/
├── schema.prisma                 # User, Thank, Tag, VerificationRequest, Report, Reward
├── seed.ts                       # 6 workers, 9 tags, 7 thanks
└── migrations/                   # Migration history

supabase/
└── storage-policies.sql          # RLS policies for Storage buckets

scripts/
├── migrate-existing-images.ts    # Migrate legacy images to Supabase Storage
├── create-tables.sql             # Legacy SQL schema reference
└── setup-prisma-user.ts          # Database user setup
```

---

## Data Model

```
User    1──N SentThanks           (senderId)
User    1──N ReceivedThanks       (receiverId)
Thank   N──M Tag                  (via _ThankTags join table)
User    1──N VerificationRequest
User    1──N Reports (reporter)
Thank   1──N Reports
```

See `prisma/schema.prisma` for full schema.

---

## Features Implemented

### Phase 1 — MVP (Appreciation Core) ✓
- **Profiles**: Worker profile with name, profession, bio, profile picture, stats
- **Thank Posts**: Create with note, tags, receiver; self-thank prevention; verified badge
- **Images**: Multi-image upload (drag-and-drop, click, camera), progressive upload to Supabase Storage, preview grid with status indicators, lightbox viewer with zoom & keyboard nav
- **Feed & Discovery**: Global feed with infinite scroll (IntersectionObserver), cursor-based pagination API (GET /api/thanks), worker browse with search, inline header search
- **Design System**: Neo Brutalist (bold borders, hard shadows, Space Grotesk, custom accent colors), warm paper background, custom scrollbar, reusable UI component library

### Phase 2 — Trust & Moderation ✓
- **Verification**: Badge system (email, phone, ID), Verification request flow with admin review, Badge display on profiles and ThankCards
- **Moderation**: Report button on ThankCard, Admin moderation dashboard, Flag/unflag content, Content removal with reason, User suspension
- **Trust & Fraud Prevention**: Per-user rate limits (max 10/hr), Same-recipient cooldown (1 hr), Trust score formula (account age, verification, reports), Fraud detection (rapid posting <5s, duplicate content <24hr)

### Technical Debt & Polish ✓
- PostgreSQL + Supabase (replaced SQLite / Prisma v7 adapter-pg)
- Supabase Auth SSR (proxy.ts convention)
- Supabase Storage RLS policies (public read, authenticated write)
- Server Actions for mutations (createThank, updateProfile, searchWorkers)
- Manual public URL construction for Storage files
- Loading states + skeletons for every route (thank/new, dashboard, profile, workers, verify, admin, home)
- Skeleton components: ThankCardSkeleton, StatsCardSkeleton, base Skeleton atom
- Error boundaries: ErrorCard component + error.tsx for every route segment
- 404 not-found.tsx with Neo Brutalist styling
- Responsive design: hamburger menu (sm: breakpoint), responsive padding, responsive image grids
- Accessibility: ARIA labels on all interactive elements, aria-modal on overlays, aria-expanded on toggles, descriptive alt text
- SEO: static metadata on all 9 pages, generateMetadata on profile/[id]
- API rate limiting: IP-based sliding window (60/min thanks, 10/min sync-user, 30/min me)
- Image optimization: next/image with unoptimized for CDN contente, remotePatterns for supabase.co + lh3.googleusercontent.com
- File upload cleanup: orphaned image removal on ThankForm unmount, admin client storage cleanup in removeThank
- Legacy image migration: migrated 7 images from public/uploads/ to Supabase Storage

---

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | Global feed of all Thanks (infinite scroll) |
| `/login` | Sign in (email/password or Google OAuth) |
| `/register` | Create account |
| `/onboarding` | Post-registration profile setup |
| `/dashboard` | User stats, recent activity, all workers grid |
| `/profile/[id]` | Worker profile: bio, stats, received Thanks |
| `/thank/new` | Create Thank: select worker, write note, pick tags, upload images |
| `/workers` | Browse all workers with search |
| `/verify` | Submit verification request |
| `/admin` | Admin dashboard |
| `/admin/moderation` | Review flagged content & reports |
| `/admin/verifications` | Review verification requests |
| `/suspended` | Notice for suspended users |

---

## API Routes

| Route | Method | Rate Limit | Description |
|-------|--------|------------|-------------|
| `/api/thanks` | GET | 60/min | Cursor-based pagination for Thank feed |
| `/api/auth/me` | GET | 30/min | Get current user |
| `/api/auth/sync-user` | POST | 10/min | Sync Supabase Auth user to DB |
| `/auth/callback` | GET | — | OAuth callback handler |

---

## Supabase Setup

### Storage Buckets
Two buckets required in Supabase Dashboard → Storage:
- `thank-images` — public, RLS enforced
- `profile-pictures` — public, RLS enforced

### RLS Policies
Run `supabase/storage-policies.sql` in Supabase Dashboard → SQL Editor:

```sql
-- thank-images: public read, authenticated write
CREATE POLICY "Public SELECT thank-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'thank-images');
CREATE POLICY "Authenticated INSERT thank-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'thank-images' AND auth.role() = 'authenticated');

-- profile-pictures: public read, authenticated write
CREATE POLICY "Public SELECT profile-pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');
CREATE POLICY "Authenticated INSERT profile-pictures" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://uveszybvktropbtnkwff.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Design System (Neo Brutalism)

- **Borders**: `border-4 border-black` everywhere
- **Shadows**:
  - `neo-shadow-sm`: 2px 2px 0 black
  - `neo-shadow`: 4px 4px 0 black
  - `neo-shadow-lg`: 8px 8px 0 black
- **Colors**:
  - `neo-yellow`: #fde047
  - `neo-pink`: #f9a8d4
  - `neo-blue`: #93c5fd
  - `neo-green`: #86efac
- **Typography**: Space Grotesk, uppercase bold labels, high contrast

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npx eslint .` | Lint (replaces `next lint`) |
| `npx prisma db seed` | Seed data (6 workers, 9 tags, 7 thanks) |
| `npx prisma migrate dev --name desc` | Create new migration |
| `npx prisma migrate reset --force` | Wipe + reapply migration |
| `npx hardhat compile` | Compile Solidity contracts |
| `npx hardhat test` | Run contract tests (17 passing) |
| `npm run test:contracts` | Alias: npx hardhat test |
| `npx hardhat run blockchain/scripts/deploy.ts --network amoy` | Deploy to Polygon Amoy |

---

## Future Roadmap

### Phase 3 — Notifications
- [ ] In-app notification when thanked
- [ ] Unread count badge in header
- [ ] Notification list page
- [ ] Push notifications (optional)

### Phase 4 — Enhanced Social Features
- **Multi-Receiver**: Schema change for Thank-to-many-Users, multi-select picker, display
- **Comments & Replies**: Comment on a Thank, reply to comments, comment count on card
- **Sharing**: Share via URL, social share buttons, embeddable widget

### Phase 5 — Token Economy ($THANK) ✓
- [x] Wallet connection (RainbowKit + wagmi, Polygon Amoy)
- [x] Wallet address on profile + rewards history page
- [x] Treasury-based reward distribution (ThankReward contract)
- [x] Trust score weighting for reward amount
- [x] Smart contracts (THANKToken ERC20 + ThankReward, 17 test passing)
- [ ] Deploy to Polygon Amoy testnet (set REWARDER_PRIVATE_KEY + run deploy script)

### Phase 6 — Ecosystem
- **Job Marketplace**: Worker service listings, hiring requests, booking, reviews
- **Business Features**: Team accounts, employer bulk thanks, business analytics, brand sponsorships
- **Monetization**: Featured profiles, paid verified badges, business subscriptions, job commission

### Remaining Tech Debt
- [ ] Image optimization (compression, resizing on upload via Supabase Image Transform)
- [ ] Responsive design audit (tablet, mobile)
- [ ] Unit and integration tests
- [ ] E2E tests (Playwright or Cypress)
- [ ] CI/CD pipeline
- [ ] Production deployment guide
- [ ] Performance monitoring

---

## Philosophy

> **Recognition first, trust second, token utility third, cash-out last.**

The platform is designed to be a **proof-of-appreciation system** for labor and contribution — not a crypto-first social network. The token economy ($THANK) is planned only after product-market validation, using a treasury-based model with capped supply to avoid inflation.

See `thank_platform_master_blueprint.md` for the full product vision.
