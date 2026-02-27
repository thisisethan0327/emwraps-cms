# EMWRAPS CMS

Headless CMS for [emwraps.net](https://emwraps.net) — built with **Payload CMS v3** + **Next.js** + **Supabase PostgreSQL**.

## Stack

- **CMS**: [Payload CMS v3](https://payloadcms.com/)
- **Framework**: Next.js 16
- **Database**: Supabase PostgreSQL (via `@payloadcms/db-postgres`)
- **Storage**: Supabase Storage S3 (via `@payloadcms/storage-s3`)
- **Rich Text**: Lexical Editor
- **SEO**: `@payloadcms/plugin-seo`

## Collections

| Collection | Purpose |
|------------|---------|
| Posts | Blog articles |
| Categories | Blog categories |
| Media | Image/video uploads |
| Projects | Portfolio/gallery items |
| FAQs | FAQ items per service page |
| Testimonials | Client reviews |
| Users | CMS admin accounts |

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`
5. Visit `http://localhost:3000/admin` to create your first admin user

## Environment Variables

See `.env.example` for all required variables. You need:

- `DATABASE_URI` — Supabase Postgres connection string
- `PAYLOAD_SECRET` — Random 32-char secret
- `S3_*` — Supabase Storage S3 credentials

## API Endpoints

The frontend at `emwraps.net` fetches content from these REST endpoints:

- `GET /api/posts` — Blog posts
- `GET /api/categories` — Blog categories
- `GET /api/projects` — Portfolio projects
- `GET /api/faqs` — FAQ items
- `GET /api/testimonials` — Client testimonials
- `GET /api/media` — Media files

## Part of the EMWRAPS Ecosystem

- **Frontend**: [emwraps-react](https://github.com/thisisethan0327/emwraps-react) — `emwraps.net`
- **CMS**: This repo — `cms.emwraps.net`
- **Ticket System**: Coming soon
