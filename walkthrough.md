# PROPZ (THANK Platform) — Implementation Walkthrough

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 |
| Database | SQLite via Prisma ORM v7 |
| Font | Space Grotesk (via next/font) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header + Sidebar + main)
│   ├── page.tsx                # Home — global feed of Thanks
│   ├── dashboard/page.tsx      # User stats + all workers
│   ├── profile/[id]/page.tsx   # Worker profile with received Thanks
│   └── thank/new/page.tsx      # Create Thank form
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky top bar with logo + nav
│   │   └── Sidebar.tsx         # Left sidebar navigation (desktop)
│   ├── ui/
│   │   ├── Button.tsx          # Neo Brutalist button (primary/secondary/outline/danger)
│   │   ├── Card.tsx            # Neo Brutalist card container
│   │   └── Input.tsx           # Styled input + textarea with labels
│   └── features/
│       ├── ThankCard.tsx       # Displays a single Thank post
│       ├── ThankForm.tsx       # Client component form for creating Thanks
│       └── StatsCard.tsx       # Dashboard stat display card
├── lib/
│   ├── prisma.ts               # PrismaClient singleton with driver adapter
│   ├── queries.ts              # Database query helpers (feed, user, stats)
│   └── actions.ts              # Server Actions (createThank, createUser)
├── generated/
│   └── prisma/                 # Generated Prisma client (gitignored)
prisma/
├── schema.prisma               # User, Thank, Tag models
├── seed.ts                     # Sample data seeder
└── migrations/                 # Prisma migration history
```

## Design System (Neo Brutalism)

- **Colors**: `neo-yellow` (#fde047), `neo-pink` (#f9a8d4), `neo-blue` (#93c5fd), `neo-green` (#86efac), `neo-border` (#000000)
- **Shadows**: `neo-shadow` (4px 4px 0 black), `neo-shadow-lg` (8px 8px), `neo-shadow-sm` (2px 2px)
- **Borders**: `border-4 border-black` everywhere
- **Typography**: Space Grotesk, uppercase bold labels, high contrast

## Database Schema

- **User**: id, name, walletAddress (optional), profession, bio, trustScore, createdAt
- **Thank**: id, senderId, receiverId, note, images (JSON string), isVerified, createdAt, tags (M:N via _ThankTags)
- **Tag**: id, name (unique)

## Key Next.js 16 Patterns Used

- `params` and `searchParams` are **async** — must be `await`ed
- Server Actions use `'use server'` directive with `revalidatePath` from `next/cache`
- `redirect()` from `next/navigation` for post-mutation redirects
- Prisma v7 uses `prisma-client` provider with driver adapter (`@prisma/adapter-better-sqlite3`)

## Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Global feed of all Thanks, newest first |
| `/dashboard` | User stats (received/sent/verified + trust score), recent activity, all workers list |
| `/profile/[id]` | Worker profile: bio, stats, received Thanks |
| `/thank/new` | Form: select worker, write note, pick tags |

## Verification

### 1. Build
```bash
npm run build
```
Should complete with no errors.

### 2. Lint
```bash
npx eslint .
```
Should have no errors (warnings OK).

### 3. Dev Server
```bash
npm run dev
```
Visit http://localhost:3000 — you should see the Neo Brutalist global feed with seeded data.

### 4. Manual Flows

**Home Page** (`/`):
- Shows list of Thank cards with sender → receiver, note, tags, timestamp
- Verified thanks show a green "VERIFIED" badge

**Dashboard** (`/dashboard`):
- Shows stats cards (Received, Sent, Verified, Trust Score)
- Recent received/sent Thanks lists
- All workers cards grid — click to visit profile

**Profile** (`/profile/[id]`):
- Worker details (name, profession, bio)
- Stats cards
- All received Thanks

**Create Thank** (`/thank/new`):
- Dropdown to select recipient worker
- Textarea for note
- Tag checkboxes
- Submit creates the Thank and redirects to the recipient's profile

## Running Seeds

```bash
npx prisma db seed
```
Populates 6 workers, 9 tags, and 7 sample Thanks.

## Database Reset

```bash
npx prisma migrate reset --force
npx prisma db seed
```
