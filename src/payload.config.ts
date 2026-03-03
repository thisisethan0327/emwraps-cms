import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections — Content
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { FAQs } from './collections/FAQs'
import { Testimonials } from './collections/Testimonials'

// Collections — Business
import { Services } from './collections/Services'
import { Promotions } from './collections/Promotions'
import { TeamMembers } from './collections/TeamMembers'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { Homepage } from './globals/Homepage'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    // ── Admin Panel ──
    admin: {
        user: Users.slug,
        meta: {
            titleSuffix: ' — EMWRAPS CMS',
            icons: [{ url: '/favicon.png' }],
        },
        components: {
            graphics: {
                Logo: './src/components/admin/Logo.tsx',
                Icon: './src/components/admin/Icon.tsx',
            },
        },
    },

    // ── Collections ──
    collections: [
        // Admin
        Users,
        // Content
        Media,
        Posts,
        Categories,
        Projects,
        FAQs,
        Testimonials,
        // Business
        Services,
        Promotions,
        TeamMembers,
    ],

    // ── Globals (site-wide settings) ──
    globals: [
        SiteSettings,
        Homepage,
        Navigation,
    ],

    // ── Database: Supabase PostgreSQL ──
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || '',
        },
        push: true, // Auto-create tables in dev (set to false for production with migrations)
        schemaName: 'cms', // Isolate CMS tables from frontend's public schema
    }),

    // ── Rich Text Editor ──
    editor: lexicalEditor(),

    // ── Plugins ──
    plugins: [
        // SEO plugin for posts, projects, and services
        seoPlugin({
            collections: ['posts', 'projects', 'services'],
            uploadsCollection: 'media',
            tabbedUI: true,
            generateTitle: ({ doc }: any) => {
                const title = doc?.title || doc?.name || '';
                return `${title} — EMWRAPS | Seattle Vehicle Wraps & PPF`;
            },
            generateDescription: ({ doc }: any) => {
                const desc = doc?.excerpt || doc?.shortDescription || doc?.description || '';
                // Limit to ~160 chars for optimal meta description
                return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
            },
            generateURL: ({ doc, collectionSlug }: any) => {
                const slug = doc?.slug || '';
                switch (collectionSlug) {
                    case 'posts':
                        return `https://emwraps.net/blog/${slug}`;
                    case 'projects':
                        return `https://emwraps.net/portfolio/${slug}`;
                    case 'services':
                        return `https://emwraps.net/${slug}`;
                    default:
                        return `https://emwraps.net/${slug}`;
                }
            },
            generateImage: ({ doc }: any) => {
                // Use featured image for posts, first image for projects
                return doc?.featuredImage || doc?.images?.[0]?.image || null;
            },
        }),

        // S3 Storage: Supabase Storage (S3-compatible)
        s3Storage({
            collections: {
                media: {
                    prefix: 'cms',
                },
            },
            bucket: process.env.S3_BUCKET || 'cms-media',
            config: {
                endpoint: process.env.S3_ENDPOINT || '',
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
                },
                region: process.env.S3_REGION || 'us-east-1',
                forcePathStyle: true,
            },
        }),
    ],

    // ── Secret ──
    secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION-32-chars',

    // ── TypeScript ──
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },

    // ── Sharp (image processing) ──
    sharp,

    // ── CORS ──
    cors: [
        ...(process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || ['https://emwraps.net']),
        'https://tickets.emwraps.net',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5176',
        'http://tg844g8ws40w0kks04k0sow0.178.156.203.41.sslip.io',
    ],

    // ── Serverless URL ──
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
})
