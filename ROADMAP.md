# PROPZ — Roadmap

Status markers: [x] done  [~] in progress  [ ] planned  [-] future

---

## Phase 1 — MVP (Appreciation Core)

### Profiles
- [x] Worker profile with name, profession, bio
- [x] Stats card (received, sent, verified, trust score)
- [x] Worker browse page with search filter
- [x] Mock auth (first user in DB is "current user")

### Thank Posts
- [x] Create Thank with note, tags, receiver
- [x] Single receiver per Thank
- [x] Self-thank prevention (server + UI)
- [x] Tag system (create-on-use via connectOrCreate)
- [x] Verified badge on ThankCard

### Images
- [x] Multi-image upload (drag-and-drop zone + click to browse)
- [x] Progressive upload (each image uploads on drop via POST /api/upload)
- [x] Upload preview grid with status indicators (spinner, check, retry)
- [x] Camera capture button (mobile + desktop fallback)
- [x] Aspect-ratio-responsive thumbnails (no cropping)
- [x] Lightroom-style ImageViewer (full-screen overlay, zoom, nav, keyboard shortcuts)

### Feed & Discovery
- [x] Global feed with infinite scroll (IntersectionObserver)
- [x] Cursor-based pagination API (GET /api/thanks)
- [x] Dashboard page (worker name heading, stats grid, received thanks)
- [x] Profile page (stats + received thanks via infinite scroll)
- [x] Workers page with client-side search

### Design System
- [x] Neo Brutalist theme (bold borders, hard shadows, high contrast)
- [x] Space Grotesk typography
- [x] Custom accent colors (yellow, pink, blue, green)
- [x] Reusable UI components (Button, Card, Input, Textarea)
- [x] Feature components (ThankCard, ThankList, StatsCard, ThankForm)
- [x] Header-only navigation with active-link highlighting
- [x] Custom scrollbar (Neo Brutalist style)
- [x] Warm paper background + tinted cards

---

## Phase 2 — Trust & Moderation

### Verification
- [ ] Worker verification badges (email, phone, ID)
- [ ] Verification request flow (submit docs, admin review)
- [ ] Verified badge display on profile and ThankCard

### Moderation
- [ ] Report button on ThankCard
- [ ] Admin moderation dashboard
- [ ] Flag/unflag content
- [ ] Content removal with reason
- [ ] User suspension

### Trust & Fraud Prevention
- [ ] Per-user rate limits (max thanks per hour/day)
- [ ] Same-recipient cooldown
- [ ] Trust score formula (account age, verification level, reports)
- [ ] Fraud detection (rapid posting, duplicate content)
- [ ] Email verification on registration

---

## Phase 3 — Accounts & Notifications

### Real Authentication
- [ ] Registration flow (name, email, profession, bio, photo)
- [ ] Email verification
- [ ] Login/password
- [ ] Session management
- [ ] Replace mock "first user" auth

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

- [ ] Image optimization (compression, resizing on upload)
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
- [ ] File upload cleanup (orphaned images)
