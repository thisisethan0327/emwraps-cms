import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { FAQs } from './collections/FAQs'
import { Testimonials } from './collections/Testimonials'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    // ── Admin Panel ──
    admin: {
        user: Users.slug,
        meta: {
            titleSuffix: ' — EMWRAPS CMS',
            icons: [{ url: '/favicon.ico' }],
        },
        components: {},
    },

    // ── Collections ──
    collections: [
        Users,
        Media,
        Posts,
        Categories,
        Projects,
        FAQs,
        Testimonials,
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
        // SEO plugin for posts and projects
        seoPlugin({
            collections: ['posts', 'projects'],
            uploadsCollection: 'media',
            generateTitle: ({ doc }: any) => `${doc?.title || ''} — EMWRAPS Blog`,
            generateDescription: ({ doc }: any) => doc?.excerpt || '',
            generateURL: ({ doc }: any) => `https://emwraps.net/blog/${doc?.slug || ''}`,
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
        process.env.CORS_ORIGINS || 'https://emwraps.net',
        'http://localhost:5173',
        'http://localhost:5174',
    ],

    // ── Serverless URL ──
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
})
