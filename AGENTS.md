<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

# PROPZ (THANK Platform) — Agent Rules

## Overview
Neo Brutalist MVP for public worker appreciation. Users send "Thanks" to workers (colleagues, employees). Each Thank has a note, optional tags, and a verified badge.

## Stack
- **Framework**: Next.js 16.2.9 (App Router, Turbopack default)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Database**: SQLite via Prisma ORM v7
- **Font**: Space Grotesk (via next/font)

## Architecture
```
src/
├── app/                          # App Router pages
│   ├── layout.tsx                # Root layout (Header + Sidebar + main)
│   ├── page.tsx                  # Home — global feed
│   ├── dashboard/page.tsx        # User stats + all workers
│   ├── profile/[id]/page.tsx     # Worker profile
│   └── thank/new/page.tsx        # Create Thank form
├── components/
│   ├── layout/                   # Header, Sidebar
│   ├── ui/                       # Button, Card, Input/Textarea
│   └── features/                 # ThankCard, ThankForm, StatsCard
├── lib/
│   ├── prisma.ts                 # PrismaClient v7 singleton (adapter-based)
│   ├── queries.ts                # DB query helpers
│   └── actions.ts                # Server Actions
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
```
See `prisma/schema.prisma` for full schema.

## Prisma v7 Gotchas
- Generator provider is `prisma-client` (NOT `prisma-client-js`)
- Output: `../src/generated/prisma`
- Import from: `@/generated/prisma/client` (NOT `@prisma/client`)
- PrismaClient constructor accepts `{ adapter }` — NO `datasources` or `datasourceUrl`
- Driver adapter: `@prisma/adapter-better-sqlite3` with `better-sqlite3`

## Next.js 16 Gotchas
- `params` and `searchParams` are async — must `await` them
- `cookies()` and `headers()` are async — must `await` them
- Use `next/cache` for `revalidatePath`/`revalidateTag`
- Use `next/navigation` for `redirect()`
- `next lint` removed — use `npx eslint .` instead

## Mock Auth
- No auth/wallet system in MVP
- First user in the database is treated as "current user"
- `getUserById('first')` returns the first user as a workaround

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
| `src/lib/queries.ts` | `getThanksFeed()`, `getUserById()`, `getUserStats()`, `getWorkers()`, `getAllTags()` |
| `src/lib/actions.ts` | `createThank()`, `createUser()` server actions |
| `prisma/seed.ts` | Sample data: 6 workers with professions, 9 tags, 7 inter-related thanks |

## Rules for AI Agents
- All code goes in `src/` directory
- Components organized by type: `ui/`, `layout/`, `features/`
- Never add emojis unless explicitly asked
- Never install new dependencies without checking if the project already uses something similar
- Keep components concise — no JSDoc comments or inline explanations
- Follow Neo Brutalist design conventions for any new UI

<!-- END:project-rules -->
