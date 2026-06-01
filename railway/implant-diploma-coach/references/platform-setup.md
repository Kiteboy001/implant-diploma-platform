# Implant Diploma Platform — Technical Reference

## Project location
`/Users/jacovandermerwe/implant-diploma-platform`

## Stack
- Next.js 16.2 (App Router, Turbopack)
- Prisma 7.8 with @prisma/adapter-pg (REQUIRED — plain `new PrismaClient()` fails)
- NextAuth v5 (credentials provider, bcrypt, JWT sessions)
- Tailwind CSS 4
- PostgreSQL 16 (local, database: `implant_diploma`)

## Key files
- `app/page.tsx` — landing page with hero, features, AI coach section
- `app/dashboard/page.tsx` — authenticated dashboard with chat widget
- `app/components/ChatWidget.tsx` — live chat UI, POSTs to /api/chat
- `app/api/chat/route.ts` — proxies to Hermes API server
- `lib/prisma.ts` — Prisma client singleton with adapter-pg
- `prisma/schema.prisma` — 13 models (User, Course, Cohort, Module, Submission, etc.)
- `auth.ts` — NextAuth config

## Brand
- Primary: #2D5A79 (steel blue)
- Dark: #282F35 (dark slate)
- Heading font: EB Garamond (from site)
- Body font: Inter
- Logo: public/tid-logo.svg (from theimplantdiploma.co.uk)
- Images: public/hero-bg.jpg, clinical-*.jpg

## Environment
- `.env.local` overrides `.env` (Next.js priority)
- `DATABASE_URL` must point to a running local PostgreSQL
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` required
- `HERMES_API_URL` and `HERMES_API_KEY` for chat integration

## Hermes integration
- Hermes profile: `~/.hermes/profiles/implant-diploma/`
- Skill: `implant-diploma-coach`
- API server: http://127.0.0.1:8642
- Gateway handles Telegram + API server

## Commands
```bash
cd ~/implant-diploma-platform
npm run dev          # :3000
npx prisma generate
npx prisma migrate dev --name <name>
```

## Design preferences (CRITICAL)
- Make **small, targeted, incremental** UI changes
- Never do sweeping redesigns without asking
- User prefers exact CSS values over vague suggestions
- The hero gradient from the site: `linear-gradient(rgba(255,255,255,0.35) 0%, rgba(40,47,53,0.92) 100%)`
