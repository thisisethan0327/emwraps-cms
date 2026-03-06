/**
 * Upload itasha photos to Supabase Storage (emwraps-images/itasha/)
 * and create a blog post via Payload CMS API.
 *
 * Usage: node create-itasha-post.mjs
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// ── Config ──
const CMS_URL = 'http://localhost:3000';
const EMAIL = 'admin@emwraps.net';
const PASSWORD = '@Emem98134';
const PHOTO_DIR = 'C:/tmp/itasha-photos';

// Supabase config (for direct storage upload)
const SUPABASE_URL = 'https://sbbxsqvoxrzcgtslspbo.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

// Photos with descriptive alt text
const PHOTOS = [
    { file: 'gr86-oguri-cap-front-quarter.jpg', alt: 'Toyota GR86 itasha wrap front quarter view — Oguri Cap Uma Musume design with StyleUp branding and RAYS wheels' },
    { file: 'gr86-oguri-cap-install-detail.jpg', alt: 'EMWRAPS technician installing Oguri Cap itasha wrap on Toyota GR86 — precision vinyl application detail' },
    { file: 'gr86-oguri-cap-side-view.jpg', alt: 'Toyota GR86 Oguri Cap The Ashen Beast itasha wrap full side view — featuring HKS, Cusco, and Yokohama sponsor decals' },
    { file: 'gr86-oguri-cap-character-closeup.jpg', alt: 'Close-up of Oguri Cap character art on Toyota GR86 itasha wrap — Uma Musume anime design with Cusco and RAYS logos' },
    { file: 'gr86-oguri-cap-install-team.jpg', alt: 'EMWRAPS team installing Oguri Cap itasha wrap on Toyota GR86 — two technicians working on side panel' },
];

// ══════════════════════════════════════════
// Step 1: Upload to Supabase Storage (emwraps-images/itasha/)
// ══════════════════════════════════════════
async function uploadToSupabaseStorage() {
    console.log('\n📦 Step 1: Uploading photos to Supabase Storage (emwraps-images/itasha/)...\n');

    // Use the Supabase anon key from the frontend .env
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnhzcXZveHJ6Y2d0c2xzcGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyNzA4MTMsImV4cCI6MjAzNjg0NjgxM30.qKMHhPuGZxki6MiLgEhM9uG3bXPQdBkD3sJHBlxh9IA';

    const supabase = createClient(SUPABASE_URL, ANON_KEY);

    const uploadedPaths = [];

    for (const photo of PHOTOS) {
        const filePath = path.join(PHOTO_DIR, photo.file);
        if (!fs.existsSync(filePath)) {
            console.warn(`  ⚠️ File not found: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const storagePath = `itasha/${photo.file}`;

        const { data, error } = await supabase.storage
            .from('emwraps-images')
            .upload(storagePath, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (error) {
            console.error(`  ❌ Failed to upload ${photo.file}: ${error.message}`);
        } else {
            const { data: urlData } = supabase.storage
                .from('emwraps-images')
                .getPublicUrl(storagePath);
            console.log(`  ✅ ${photo.file} → ${urlData.publicUrl}`);
            uploadedPaths.push(urlData.publicUrl);
        }
    }

    return uploadedPaths;
}

// ══════════════════════════════════════════
// Step 2: Upload to CMS Media (→ Supabase S3 cms-media bucket)
// ══════════════════════════════════════════
async function loginCMS() {
    const res = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const data = await res.json();
    if (!data.token) throw new Error('CMS Login failed: ' + JSON.stringify(data));
    console.log('✅ Logged into Payload CMS');
    return data.token;
}

async function uploadMediaToCMS(token, filePath, altText) {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    formData.append('file', blob, fileName);
    formData.append('_payload', JSON.stringify({ alt: altText }));

    const res = await fetch(`${CMS_URL}/api/media`, {
        method: 'POST',
        headers: { 'Authorization': `JWT ${token}` },
        body: formData,
    });
    const data = await res.json();
    if (data.doc) {
        console.log(`  📷 CMS Media: ${fileName} → ID ${data.doc.id}`);
        return data.doc;
    }
    throw new Error(`CMS upload failed for ${fileName}: ${JSON.stringify(data)}`);
}

// ══════════════════════════════════════════
// Step 3: Create Blog Post
// ══════════════════════════════════════════

function paragraph(text) {
    return {
        type: 'paragraph',
        children: [{ type: 'text', text, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
    };
}

function heading(text, level) {
    return {
        type: 'heading',
        tag: `h${level}`,
        children: [{ type: 'text', text, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
    };
}

function bulletList(items) {
    return {
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        children: items.map(text => ({
            type: 'listitem',
            children: [{ type: 'text', text, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            value: 1,
            version: 1,
        })),
        direction: 'ltr',
        format: '',
        indent: 0,
        start: 1,
        version: 1,
    };
}

function imageBlock(mediaDoc) {
    return {
        type: 'upload',
        relationTo: 'media',
        value: mediaDoc.id,
        format: '',
        version: 2,
    };
}

function createLexicalContent(images) {
    return {
        root: {
            type: 'root',
            children: [
                // Intro
                paragraph('When car culture meets anime, magic happens. This Toyota GR86 received the full itasha treatment — a stunning Oguri Cap wrap from Uma Musume: Pretty Derby, themed "The Ashen Beast." The design combines aggressive racing aesthetics with beautifully illustrated character art, creating a show-stopping build that turns heads at every car meet.'),

                heading('The Build: Oguri Cap "The Ashen Beast" GR86', 2),

                paragraph('This GR86 itasha project was a collaboration between the owner\'s vision and our design team. The wrap features Oguri Cap — one of the most iconic characters from Uma Musume — in a dynamic, action-packed pose that flows naturally with the car\'s body lines. The design incorporates a monochrome palette with strategic pops of color in the character art, creating a cohesive look that\'s both aggressive and elegant.'),

                // Image 1 — front quarter
                ...(images[0] ? [imageBlock(images[0])] : []),

                heading('Design & Sponsor Integration', 2),

                paragraph('What makes this build special is the seamless integration of sponsor logos into the overall design. The wrap features branding from StyleUp, HKS, Cusco, Yokohama, and RAYS — all positioned to complement the character art rather than compete with it. The halftone dot patterns and angular slash graphics add depth and motion to the design, echoing the car\'s racing DNA.'),

                bulletList([
                    'Full side panel wrap with Oguri Cap character art',
                    'Coordinated fender and quarter panel graphics with halftone patterns',
                    'Integrated sponsor logos: StyleUp, HKS, Cusco, Yokohama, RAYS',
                    'Monochrome base with strategic color accents in character illustration',
                    '"The Ashen Beast" custom typography treatment',
                ]),

                // Image 2 — side view
                ...(images[2] ? [imageBlock(images[2])] : []),

                heading('The Installation Process', 2),

                paragraph('Installing an itasha wrap requires a different skillset than standard color change wraps. Every panel must be precisely aligned so the character art flows seamlessly across door gaps, fender lines, and body curves. Our team worked meticulously to ensure Oguri Cap\'s expression and pose remained perfect across the GR86\'s complex body lines.'),

                paragraph('The installation involved careful heat application around the car\'s aggressive fender flares and sculpted side skirts. Each section was hand-finished to ensure bubble-free application and clean edge wrapping, especially around the door handles, mirror caps, and gas cap — areas where most shops cut corners.'),

                // Image 3 — install detail
                ...(images[1] ? [imageBlock(images[1])] : []),

                // Image 4 — team working
                ...(images[4] ? [imageBlock(images[4])] : []),

                heading('Character Art Close-Up', 2),

                paragraph('The star of the show is the Oguri Cap illustration itself. The character is depicted in her signature white and navy uniform, complete with her distinctive hair accessories. The art style stays true to the Uma Musume aesthetic while being optimized for large-format printing on automotive vinyl — ensuring color vibrancy, detail sharpness, and UV resistance for years of show-quality appearance.'),

                // Image 5 — character closeup
                ...(images[3] ? [imageBlock(images[3])] : []),

                heading('Bring Your Itasha Vision to Life', 3),

                paragraph('Whether you\'re dreaming of a full itasha build, a subtle anime accent, or a custom livery design, EMWRAPS has the experience and craftsmanship to make it happen. We specialize in complex, design-forward wraps that stand out at car meets and shows. Contact us at (206) 383-5328 or book a free consultation online to start your project.'),
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
        },
    };
}

// ── Main ──
async function main() {
    console.log('🚀 Creating Itasha GR86 Oguri Cap blog post...\n');

    // Step 1: Upload to Supabase Storage
    let storagePaths = [];
    try {
        storagePaths = await uploadToSupabaseStorage();
        console.log(`\n✅ Uploaded ${storagePaths.length} photos to Supabase Storage\n`);
    } catch (err) {
        console.warn(`⚠️ Supabase storage upload skipped (may need service key): ${err.message}`);
        console.log('Continuing with CMS upload only...\n');
    }

    // Step 2: Login to CMS and upload media
    console.log('📸 Step 2: Uploading photos to CMS Media (→ Supabase S3)...\n');
    const token = await loginCMS();

    // Get category "Project Spotlight"
    const catRes = await fetch(`${CMS_URL}/api/categories?where[slug][equals]=project-spotlight`, {
        headers: { 'Authorization': `JWT ${token}` },
    });
    const catData = await catRes.json();
    const categoryId = catData.docs?.[0]?.id;
    console.log(`📁 Category: Project Spotlight (ID: ${categoryId})`);

    // Upload all photos to CMS
    const uploadedImages = [];
    for (const photo of PHOTOS) {
        const filePath = path.join(PHOTO_DIR, photo.file);
        if (fs.existsSync(filePath)) {
            const mediaDoc = await uploadMediaToCMS(token, filePath, photo.alt);
            uploadedImages.push(mediaDoc);
        } else {
            console.warn(`  ⚠️ Image not found: ${filePath}`);
        }
    }

    if (uploadedImages.length === 0) {
        throw new Error('No images were uploaded — cannot create post without images');
    }

    // Step 3: Create blog post
    console.log('\n📝 Step 3: Creating blog post...');
    const content = createLexicalContent(uploadedImages);

    const postData = {
        title: 'Toyota GR86 Oguri Cap Itasha Wrap — "The Ashen Beast" Build',
        slug: 'toyota-gr86-oguri-cap-itasha-wrap',
        excerpt: 'A stunning Toyota GR86 itasha build featuring Oguri Cap from Uma Musume: Pretty Derby. Full side wrap with "The Ashen Beast" design, integrated sponsor logos from HKS, Cusco, Yokohama, and RAYS, custom halftone graphics, and precision installation by the EMWRAPS team.',
        content,
        featuredImage: uploadedImages[0].id,
        category: categoryId,
        author: 1,
        status: 'published',
        _status: 'published',
        publishedAt: new Date().toISOString(),
        relatedService: 'itasha',
        tags: [
            { tag: 'Itasha' },
            { tag: 'Toyota GR86' },
            { tag: 'Uma Musume' },
            { tag: 'Oguri Cap' },
            { tag: 'Anime Wrap' },
            { tag: 'Custom Design' },
            { tag: 'Full Wrap' },
        ],
    };

    const postRes = await fetch(`${CMS_URL}/api/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
        },
        body: JSON.stringify(postData),
    });
    const postResult = await postRes.json();

    if (postResult.doc) {
        console.log(`\n✅ Blog post created!`);
        console.log(`   Title:  ${postResult.doc.title}`);
        console.log(`   Slug:   ${postResult.doc.slug}`);
        console.log(`   ID:     ${postResult.doc.id}`);
        console.log(`   Status: ${postResult.doc.status}`);
        console.log(`\n🔗 View in CMS:     ${CMS_URL}/admin/collections/posts/${postResult.doc.id}`);
        console.log(`🔗 View on frontend: https://emwraps.net/blog/${postResult.doc.slug}`);
        console.log(`🔗 API endpoint:     ${CMS_URL}/api/posts?where[slug][equals]=${postResult.doc.slug}`);

        if (storagePaths.length > 0) {
            console.log(`\n📦 Supabase Storage URLs:`);
            storagePaths.forEach(url => console.log(`   ${url}`));
        }
    } else {
        console.error('❌ Failed to create post:', JSON.stringify(postResult, null, 2));
    }
}

main().catch(console.error);
