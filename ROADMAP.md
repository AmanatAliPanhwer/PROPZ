# PROPZ — Roadmap

Status markers: [x] done  [~] in progress  [ ] planned  [-] future

---

## Phase 1 — MVP (Appreciation Core)

### Profiles
- [x] Worker profile with name, profession, bio
- [x] Stats card (received, sent, verified, trust score)
- [x] Worker browse page with client-side search
- [x] Inline header search (dropdown, profile pics, debounced server query)
- [x] Edit profile in dashboard (inline editing, profile picture upload)
- [x] Supabase Auth (Email/Password + Google OAuth, session via proxy.ts)

### Thank Posts
- [x] Create Thank with note, tags, receiver
- [x] Single receiver per Thank
- [x] Self-thank prevention (server + UI)
- [x] Tag system (create-on-use via connectOrCreate)
- [x] Verified badge on ThankCard

### Images
- [x] Multi-image upload (drag-and-drop zone + click to browse + camera)
- [x] Progressive upload (each image uploads directly to Supabase Storage on select/drop)
- [x] Upload preview grid with status indicators (spinner, check, retry)
- [x] Aspect-ratio-responsive thumbnails (no cropping)
- [x] Lightroom-style ImageViewer (full-screen overlay, zoom, nav, keyboard shortcuts)

### Feed & Discovery
- [x] Global feed with infinite scroll (IntersectionObserver)
- [x] Cursor-based pagination API (GET /api/thanks)
- [x] Dashboard page (worker name heading, stats grid, received thanks)
- [x] Profile page (stats + received thanks via infinite scroll)

### Design System
- [x] Neo Brutalist theme (bold borders, hard shadows, high contrast)
- [x] Space Grotesk typography
- [x] Custom accent colors (yellow, pink, blue, green)
- [x] Reusable UI components (Button, Card, Input, Textarea)
- [x] Feature components (ThankCard, ThankList, StatsCard, ThankForm, DashboardProfile)
- [x] Header-only navigation with active-link highlighting and inline search
- [x] Custom scrollbar (Neo Brutalist style)
- [x] Warm paper background + tinted cards

---

## Phase 2 — Trust & Moderation

### Verification
- [x] Worker verification badges (email, phone, ID)
- [x] Verification request flow (submit docs, admin review)
- [x] Verified badge display on profile and ThankCard

### Moderation
- [x] Report button on ThankCard
- [x] Admin moderation dashboard
- [x] Flag/unflag content
- [x] Content removal with reason
- [x] User suspension

### Trust & Fraud Prevention
- [x] Per-user rate limits (max thanks per hour)
- [x] Same-recipient cooldown
- [x] Trust score formula (account age, verification level, reports)
- [x] Fraud detection (rapid posting, duplicate content)

---

## Phase 3 — Notifications

### Notifications
- [ ] In-app notification when thanked
- [ ] Unread count badge in header
- [ ] Notification list page
- [ ] Push notifications (optional)

---

## Phase 4 — Enhanced Social Features

### Multi-Receiver Tagging
- [ ] Schema change: Thank-to-many-Users join table
- [ ] Multi-select receiver picker in ThankForm
- [ ] Display multiple receivers in ThankCard

### Comments & Replies
- [ ] Comment on a Thank
- [ ] Reply to comments
- [ ] Comment count on ThankCard

### Sharing
- [ ] Share Thank via URL
- [ ] Social share buttons
- [ ] Embeddable Thank widget

---

## Phase 5 — Token Economy ($THANK)

### Wallet Integration
- [ ] Wallet connection (browser extension, mobile wallet)
- [ ] Wallet address on profile
- [ ] Balance display

### Reward System
- [ ] Treasury-based reward distribution
- [ ] Verified thanks trigger reward eligibility
- [ ] Trust score weighting for reward amount
- [ ] Reward history page

### Smart Contracts
- [ ] Reward worker function
- [ ] Record verified thank on-chain
- [ ] Treasury management
- [ ] Emergency pause
- [ ] Token transfer

---

## Phase 6 — Ecosystem

### Job Marketplace
- [ ] Worker service listings
- [ ] Hiring requests
- [ ] Booking system
- [ ] Reviews and ratings

### Business Features
- [ ] Business/team accounts
- [ ] Bulk thanks (employer to team)
- [ ] Analytics dashboard for businesses
- [ ] Brand sponsorships

### Monetization
- [ ] Featured worker profiles
- [ ] Verified badges (paid)
- [ ] Business pages (subscription)
- [ ] Job booking commission

---

## Technical Debt & Polish

- [x] PostgreSQL + Supabase (replaced SQLite / Prisma v7 adapter-pg)
- [x] Supabase Auth SSR (proxy.ts convention instead of deprecated middleware.ts)
- [x] Supabase Storage RLS policies (public read, authenticated write)
- [x] Server Actions for mutations (createThank, updateProfile, searchWorkers)
- [x] Manual public URL construction for Storage files (workaround for getPublicUrl() bug)
- [ ] Image optimization (compression, resizing on upload via Supabase Image Transform)
- [ ] Responsive design audit (tablet, mobile)
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] SEO meta tags per page
- [ ] Performance monitoring
- [ ] Unit and integration tests
- [ ] E2E tests (Playwright or Cypress)
- [ ] CI/CD pipeline
- [ ] Production deployment guide
- [ ] Rate limiting on API routes
- [ ] File upload cleanup (orphaned images in Storage)
- [ ] Migrate legacy images from public/uploads/ to Supabase Storage
