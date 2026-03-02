/**
 * Create a real blog post with actual images via the Payload CMS API.
 * Uploads images from the frontend's public/img folder to CMS media (Supabase S3),
 * then creates a blog post with Lexical rich text content.
 *
 * Usage: node create-blog-post.mjs
 */

import fs from 'fs';
import path from 'path';

const CMS_URL = 'http://localhost:3001';
const EMAIL = 'admin@emwraps.net';
const PASSWORD = '@Emem98134';

// Frontend images to use for the blog post
const FRONTEND_IMG_DIR = path.resolve('../emwraps-react/public/img');

// ── Auth ──
async function login() {
    const res = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const data = await res.json();
    if (!data.token) throw new Error('Login failed: ' + JSON.stringify(data));
    console.log('✅ Logged in');
    return data.token;
}

// ── Upload an image file to CMS media (→ Supabase S3) ──
async function uploadMedia(token, filePath, altText) {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const blob = new Blob([fileBuffer], { type: getMimeType(fileName) });
    formData.append('file', blob, fileName);
    // Payload CMS expects collection field values in a _payload JSON string
    formData.append('_payload', JSON.stringify({ alt: altText }));

    const res = await fetch(`${CMS_URL}/api/media`, {
        method: 'POST',
        headers: { 'Authorization': `JWT ${token}` },
        body: formData,
    });
    const data = await res.json();
    if (data.doc) {
        console.log(`  📷 Uploaded: ${fileName} → ID ${data.doc.id}`);
        return data.doc;
    }
    throw new Error(`Upload failed for ${fileName}: ${JSON.stringify(data)}`);
}

function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
    return types[ext] || 'application/octet-stream';
}

// ── Create Lexical rich text content ──
function createLexicalContent(images) {
    return {
        root: {
            type: 'root',
            children: [
                // Intro paragraph
                paragraph('When a client trusts EMWRAPS with a $900,000+ hypercar, every detail matters. This Ferrari SF90 XX Stradale received our most comprehensive Paint Protection Film package — full body coverage using UNITY USA\'s Ultra-Gloss PPF with a 10-year manufacturer warranty.'),

                // Heading
                heading('The Build: Full Body PPF on a Hypercar', 2),

                paragraph('The SF90 XX is Ferrari\'s most powerful road car ever produced — 1,030 horsepower from a twin-turbo V8 hybrid powertrain. With only a limited number produced worldwide, protecting the factory paint isn\'t optional — it\'s essential.'),

                paragraph('Our team spent 5 full days meticulously wrapping every painted surface. The SF90 XX\'s complex body lines, aggressive aero elements, and carbon fiber components required our highest level of precision.'),

                // Image 1 — hero shot
                ...(images[0] ? [imageBlock(images[0])] : []),

                heading('Why UNITY USA PPF?', 2),

                paragraph('We chose UNITY USA\'s flagship Ultra-Gloss film for this build. Here\'s why:'),

                // Bullet list
                bulletList([
                    '10-year manufacturer warranty — the longest in the industry',
                    'Self-healing top coat that repairs scratches with heat',
                    '99.9% optical clarity — the film is virtually invisible',
                    'Hydrophobic surface that repels water, dirt, and contaminants',
                    '7.5-mil thickness for maximum impact protection',
                ]),

                // Image 2 — detail shot
                ...(images[1] ? [imageBlock(images[1])] : []),

                heading('The Process', 2),

                paragraph('Day 1-2: Complete vehicle decontamination — clay bar treatment, IPA wipe-down, and paint correction on any existing imperfections. The SF90 XX arrived in showroom condition, but we still found minor transport marks that needed addressing before film application.'),

                paragraph('Day 3-4: Film installation on all major panels — hood, fenders, doors, quarter panels, roof, trunk, and bumpers. Each panel is cut using our precision plotter and hand-finished for seamless edge wrapping.'),

                paragraph('Day 5: Detail work — door edges, door cups, mirror caps, A-pillars, rocker panels, and headlights. Final inspection under our multi-angle LED lighting rig to ensure zero contamination, bubbles, or lifting.'),

                // Image 3 — another angle
                ...(images[2] ? [imageBlock(images[2])] : []),

                heading('The Result', 2),

                paragraph('The SF90 XX left our shop with invisible, self-healing armor protecting every painted surface. The owner can now enjoy spirited driving without worrying about rock chips, bug acids, bird droppings, or UV fading destroying the factory finish.'),

                paragraph('The total coverage includes protection on areas most shops skip — door edges, rocker panels, and the underside of the rear spoiler. These high-impact zones are where road debris does the most damage, especially on a car that gets driven hard.'),

                heading('Ready to Protect Your Investment?', 3),

                paragraph('Whether you drive a hypercar or a daily, your paint deserves protection. Contact EMWRAPS for a free PPF consultation — we\'ll recommend the right coverage level for your vehicle and driving style. Call (206) 383-5328 or book online.'),
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
        },
    };
}

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
        type: 'block',
        fields: {
            blockType: 'mediaBlock',
            media: mediaDoc.id,
        },
        format: '',
        version: 2,
    };
}

// ── Main ──
async function main() {
    console.log('🚀 Creating Ferrari SF90 XX PPF blog post...\n');

    const token = await login();

    // Get categories list to find "Project Spotlight"
    const catRes = await fetch(`${CMS_URL}/api/categories?where[slug][equals]=project-spotlight`, {
        headers: { 'Authorization': `JWT ${token}` },
    });
    const catData = await catRes.json();
    const categoryId = catData.docs?.[0]?.id;
    console.log(`📁 Category: Project Spotlight (ID: ${categoryId})`);

    // Upload 3 images from the SF90 XX folder
    console.log('\n📸 Uploading images to CMS (→ Supabase S3)...');
    const imgDir = path.join(FRONTEND_IMG_DIR, 'ppf/clear/sf90XX');

    const imagesToUpload = [
        { file: 'emwraps_1759420800_3734346907021267675_5673697168.jpg', alt: 'Ferrari SF90 XX Stradale with full body UNITY USA PPF — front three-quarter view' },
        { file: 'emwraps_1759420800_3734346907021274444_5673697168.jpg', alt: 'Ferrari SF90 XX Stradale PPF installation detail — close-up of film edge work' },
        { file: 'sf90_front_1771357883557.png', alt: 'Ferrari SF90 XX Stradale — front view showing PPF coverage on hood and bumper' },
    ];

    const uploadedImages = [];
    for (const img of imagesToUpload) {
        const filePath = path.join(imgDir, img.file);
        if (fs.existsSync(filePath)) {
            const mediaDoc = await uploadMedia(token, filePath, img.alt);
            uploadedImages.push(mediaDoc);
        } else {
            console.warn(`  ⚠️ Image not found: ${filePath}`);
        }
    }

    // Use the first uploaded image as featured image
    const featuredImageId = uploadedImages[0]?.id;
    if (!featuredImageId) {
        throw new Error('No images were uploaded — cannot create post without featured image');
    }

    // Create the blog post
    console.log('\n📝 Creating blog post...');
    const content = createLexicalContent(uploadedImages);

    const postData = {
        title: 'Ferrari SF90 XX Stradale — Full Body PPF Build',
        slug: 'ferrari-sf90-xx-full-body-ppf',
        excerpt: 'A deep dive into our most ambitious PPF project yet — full body UNITY USA Ultra-Gloss paint protection film on a $900K+ Ferrari SF90 XX Stradale. 5 days, every panel, 10-year warranty.',
        content,
        featuredImage: featuredImageId,
        category: categoryId,
        author: 1, // Admin user
        status: 'published',
        publishedAt: new Date().toISOString(),
        relatedService: 'ppf',
        tags: [
            { tag: 'Ferrari' },
            { tag: 'SF90 XX' },
            { tag: 'PPF' },
            { tag: 'Paint Protection Film' },
            { tag: 'UNITY USA' },
            { tag: 'Full Body' },
            { tag: 'Hypercar' },
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
        console.log(`   Title: ${postResult.doc.title}`);
        console.log(`   Slug:  ${postResult.doc.slug}`);
        console.log(`   ID:    ${postResult.doc.id}`);
        console.log(`   Status: ${postResult.doc.status}`);
        console.log(`\n🔗 View in CMS:     ${CMS_URL}/admin/collections/posts/${postResult.doc.id}`);
        console.log(`🔗 View on frontend: http://localhost:5173/blog/${postResult.doc.slug}`);
        console.log(`🔗 API endpoint:     ${CMS_URL}/api/posts?where[slug][equals]=${postResult.doc.slug}`);
    } else {
        console.error('❌ Failed to create post:', JSON.stringify(postResult, null, 2));
    }
}

main().catch(console.error);
