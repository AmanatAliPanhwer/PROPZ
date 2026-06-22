<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

# PROPZ (THANK Platform) — Agent Rules

## Overview
Neo Brutalist MVP for public worker appreciation. Users send "Thanks" to workers. Each Thank has a note, optional tags, optional images, and a verified badge.

## Stack
- **Framework**: Next.js 16.2.9 (App Router, Turbopack default)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Prisma ORM v7 (adapter-pg)
- **Auth**: Supabase Auth (Email/Password + Google OAuth, SSR via proxy.ts)
- **Storage**: Supabase Storage (thank-images, profile-pictures buckets)
- **Font**: Space Grotesk (via next/font)
- **Icons**: react-icons (FiCamera)

## Architecture
```
src/
├── app/                          # App Router pages
│   ├── layout.tsx                # Root layout (Header + main)
│   ├── page.tsx                  # Home — global feed
│   ├── loading.tsx/error.tsx/not-found.tsx
│   ├── dashboard/page.tsx        # User stats + workers grid
│   ├── profile/[id]/page.tsx     # Worker profile
│   ├── thank/new/page.tsx        # Create Thank form
│   ├── workers/page.tsx          # Browse workers
│   ├── verify/page.tsx           # Verification request
│   ├── admin/{page,moderation,verifications}/
│   ├── login/register/onboarding/suspended/
│   ├── auth/callback/route.ts    # OAuth handler
│   └── api/                      # thanks, auth/me, auth/sync-user
├── components/
│   ├── layout/                   # Header
│   ├── ui/                       # Button, Card, Input, Textarea, Skeleton, ErrorCard
│   └── features/                 # ThankCard/ThankList/ThankForm, StatsCard,
│                                 # DashboardProfile, ImageViewer, InlineSearch,
│                                 # ReportModal, VerificationBadge, *Skeleton variants
├── lib/
│   ├── prisma.ts                 # PrismaClient v7 singleton (adapter-pg)
│   ├── queries.ts                # DB query helpers
│   ├── actions.ts                # Server Actions
│   ├── rate-limit.ts             # IP-based sliding window rate limiter
│   └── supabase/                 # client.ts, server.ts, admin.ts
├── proxy.ts                      # Supabase Auth SSR proxy
└── generated/prisma/             # Prisma client output (gitignored)
```

## Design System (Neo Brutalism)
- Bold black borders everywhere: `border-4 border-black`
- Hard drop shadows: `neo-shadow` (4px 4px 0 black), `neo-shadow-lg` (8px 8px), `neo-shadow-sm` (2px 2px)
- Colors: `neo-yellow` (#fde047), `neo-pink` (#f9a8d4), `neo-blue` (#93c5fd), `neo-green` (#86efac)
- Typography: Space Grotesk, uppercase bold labels, high contrast
- See `src/app/globals.css` for utility classes

## Data Model
```
User   1──N SentThanks     (senderId)
User   1──N ReceivedThanks (receiverId)
Thank  N──M Tag            (via _ThankTags join table)
User   1──N VerificationRequest
Thank  1──N Report
```
See `prisma/schema.prisma` for full schema.

## Prisma v7 Gotchas
- Generator provider is `prisma-client` (NOT `prisma-client-js`)
- Output: `../src/generated/prisma`
- Import from: `@/generated/prisma/client` (NOT `@prisma/client`)
- PrismaClient constructor accepts `{ adapter }` — NO `datasources` or `datasourceUrl`
- Driver adapter: `@prisma/adapter-pg` with `pg` package

## Next.js 16 Gotchas
- `params` and `searchParams` are async — must `await` them
- `cookies()` and `headers()` are async — must `await` them
- Use `next/cache` for `revalidatePath`/`revalidateTag`
- Use `next/navigation` for `redirect()`
- `next lint` removed — use `npx eslint .` instead

## Supabase Auth
- Users sign up via Supabase Auth (Email/Password or Google OAuth)
- Auth session managed via `@supabase/ssr` (cookies) with proxy.ts
- Browser client: `createClient()` from `@/lib/supabase/client`
- Server client: `createServerSupabaseClient()` from `@/lib/supabase/server`
- Admin client (bypasses RLS): `createAdminClient()` from `@/lib/supabase/admin`

## Supabase Storage
- Two buckets: `thank-images` (public) and `profile-pictures` (public)
- RLS policies: public SELECT, authenticated INSERT
- Upload from browser via `createClient()` (needs valid auth session)
- Storage deletes in server actions use `createAdminClient()` to bypass RLS
- Manual public URL construction: `${SUPABASE_URL}/storage/v1/object/public/thank-images/${filename}`

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npx eslint .` | Lint |
| `npx prisma db seed` | Seed data (6 workers, 9 tags, 7 thanks) |
| `npx prisma migrate dev --name desc` | Create new migration |
| `npx prisma migrate reset --force` | Wipe + reapply migration |

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/prisma.ts` | PrismaClient singleton with v7 adapter |
| `src/lib/queries.ts` | getCurrentUser, getThanksFeed, getUserById, getUserStats, getWorkers, getAllTags |
| `src/lib/actions.ts` | createThank, createUser, updateProfile, removeThank, flagThank, etc. |
| `src/lib/rate-limit.ts` | IP-based sliding window rate limiter for API routes |
| `src/lib/supabase/admin.ts` | Admin client (service role key, bypasses RLS) |
| `src/lib/supabase/client.ts` | Browser client (anon key, auth session from cookies) |
| `src/lib/supabase/server.ts` | Server client (anon key, cookie management) |
| `src/proxy.ts` | Supabase Auth SSR proxy (cookie handling) |
| `prisma/schema.prisma` | Full database schema (User, Thank, Tag, VerificationRequest, Report) |
| `prisma/seed.ts` | Sample data: 6 workers with professions, 9 tags, 7 inter-related thanks |
| `supabase/storage-policies.sql` | RLS policies for Storage buckets |
| `scripts/migrate-existing-images.ts` | Migrate legacy images from public/uploads/ to Supabase Storage |

## Rules for AI Agents
- All code goes in `src/` directory
- Components organized by type: `ui/`, `layout/`, `features/`
- Never add emojis unless explicitly asked
- Never install new dependencies without checking if the project already uses something similar
- Keep components concise — no JSDoc comments or inline explanations
- Follow Neo Brutalist design conventions for any new UI

<!-- END:project-rules -->
