/**
 * EMWRAPS Gallery Migration + Blog Post Generator
 * 
 * Uploads all showcase images to CMS Media (Supabase S3),
 * creates Project entries, and generates blog posts for each.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CMS_URL = 'http://localhost:3001';
const FRONTEND_PUBLIC = path.resolve(__dirname, '../emwraps-react/public');
const CREDENTIALS = { email: 'admin@emwraps.net', password: '@Emem98134' };

let TOKEN = '';

// ──────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────────────

async function login() {
    const res = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CREDENTIALS),
    });
    const data = await res.json();
    TOKEN = data.token;
    console.log('✅ Logged in');
    return TOKEN;
}

async function uploadMedia(filePath, alt) {
    const form = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    form.append('file', blob, fileName);
    form.append('_payload', JSON.stringify({ alt }));

    const res = await fetch(`${CMS_URL}/api/media`, {
        method: 'POST',
        headers: { 'Authorization': `JWT ${TOKEN}` },
        body: form,
    });
    const data = await res.json();
    if (data.doc) {
        console.log(`  📸 Uploaded: ${fileName} (ID: ${data.doc.id})`);
        return data.doc;
    }
    console.error(`  ❌ Upload failed: ${fileName}`, data.errors?.[0]?.message || data.message);
    return null;
}

async function getCategoryId(slug) {
    const res = await fetch(`${CMS_URL}/api/categories?where[slug][equals]=${slug}&limit=1`, {
        headers: { 'Authorization': `JWT ${TOKEN}` },
    });
    const data = await res.json();
    return data.docs?.[0]?.id || null;
}

async function createProject(projectData) {
    const res = await fetch(`${CMS_URL}/api/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${TOKEN}`,
        },
        body: JSON.stringify(projectData),
    });
    const data = await res.json();
    if (data.doc) {
        console.log(`  🏗️  Project: "${data.doc.title}" (ID: ${data.doc.id})`);
        return data.doc;
    }
    console.error(`  ❌ Project failed:`, data.errors?.[0]?.message || data.message);
    return null;
}

async function createPost(postData) {
    const res = await fetch(`${CMS_URL}/api/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${TOKEN}`,
        },
        body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (data.doc) {
        console.log(`  📝 Blog Post: "${data.doc.title}" (ID: ${data.doc.id})`);
        return data.doc;
    }
    console.error(`  ❌ Blog post failed:`, data.errors?.[0]?.message || data.message);
    return null;
}

// ──────────────────────────────────────────────────
// LEXICAL CONTENT HELPERS
// ──────────────────────────────────────────────────

function paragraph(text) {
    return { type: 'paragraph', children: [{ type: 'text', text, format: 0, mode: 'normal', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 };
}

function heading(text, tag = 'h2') {
    return { type: 'heading', tag, children: [{ type: 'text', text, format: 0, mode: 'normal', version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 };
}

function uploadNode(mediaId) {
    return { type: 'upload', relationTo: 'media', value: mediaId, format: '', version: 2 };
}

function listItem(text) {
    return { type: 'listitem', children: [{ type: 'text', text, format: 0, mode: 'normal', version: 1 }], direction: 'ltr', format: '', indent: 0, value: 1, version: 1 };
}

function bulletList(items) {
    return { type: 'list', listType: 'bullet', children: items.map(listItem), direction: 'ltr', format: '', indent: 0, start: 1, tag: 'ul', version: 1 };
}

function lexicalRoot(children) {
    return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } };
}

// ──────────────────────────────────────────────────
// PROJECT DEFINITIONS
// ──────────────────────────────────────────────────

const PROJECTS = [
    // ── PPF ──
    {
        title: 'Porsche 992.2 GT3 — Full Body PPF',
        slug: 'porsche-992-gt3-full-body-ppf',
        service: 'ppf',
        vehicle: { make: 'Porsche', model: '992.2 GT3', color: 'White' },
        material: 'UNITY USA',
        coverage: 'Full Body',
        finish: 'Gloss',
        featured: true,
        order: 2,
        images: [
            { path: 'ppf/clear/porsche_992.2/emwraps_1724353028_3440445025174610365_5673697168 -1.jpg', alt: 'Porsche 992.2 GT3 full body PPF — front three-quarter view' },
            { path: 'ppf/clear/porsche_992.2/PPF1.jpg', alt: 'Porsche 992.2 GT3 PPF installation detail' },
            { path: 'ppf/clear/porsche_992.2/emwraps_1724353028_3440445025359199601_5673697168.jpg', alt: 'Porsche 992.2 GT3 PPF — rear three-quarter view' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Porsche 992.2 GT3 — Full Body Clear PPF Build',
            excerpt: 'Full body UNITY USA clear paint protection film on a brand new Porsche 992.2 GT3. 10-year warranty, self-healing technology, and invisible shield for one of Porsche\'s most track-focused machines.',
            category: 'project-spotlight',
            relatedService: 'ppf',
            tags: ['Porsche', '992 GT3', 'PPF', 'Paint Protection Film', 'UNITY USA', 'Full Body', 'Clear PPF'],
            contentFn: (mediaIds) => [
                paragraph('When a brand new Porsche 992.2 GT3 rolls into the shop, you know the owner takes performance seriously. This build was all about protecting that incredible paint finish from the rigors of both street and track use.'),
                heading('The Build: Full Body Clear PPF'),
                paragraph('The 992.2 GT3 is one of Porsche\'s most exciting cars — a naturally aspirated flat-six producing 502 horsepower, mated to a PDK or manual transmission. The owner opted for full body UNITY USA Ultra-Gloss PPF to keep every panel protected without altering the factory appearance.'),
                uploadNode(mediaIds[0]),
                heading('Why UNITY USA PPF?'),
                bulletList([
                    '10-year manufacturer warranty — industry-leading coverage',
                    'Self-healing top coat that repairs scratches with heat',
                    '99.9% optical clarity — virtually invisible protection',
                    'Hydrophobic surface that repels water and contaminants',
                    'Perfect for track days — protects against rock chips and debris',
                ]),
                uploadNode(mediaIds[1]),
                heading('The Process'),
                paragraph('Full body PPF on a GT3 requires meticulous attention to detail. The aggressive aero elements — the massive rear wing, front splitter, and side air intakes — each need custom-fitted panels cut with precision.'),
                paragraph('Our team spent 4 full days on this build, ensuring every edge was tucked, every panel was aligned, and every complex curve was wrapped without distortion.'),
                heading('The Result'),
                paragraph('The GT3 left our shop with an invisible layer of armor protecting every painted surface. The owner can now enjoy spirited driving — on the street or at Pacific Raceways — without worrying about rock chips, bug acids, or UV damage destroying that stunning white paint.'),
                uploadNode(mediaIds[2]),
                heading('Ready to Protect Your Porsche?'),
                paragraph('Whether it\'s a GT3, GT4, Turbo S, or Cayenne — we\'ve wrapped them all. UNITY USA PPF with a 10-year warranty is the gold standard in paint protection. Contact EMWRAPS at (206) 383-5328 or book online.'),
            ],
        },
    },
    {
        title: 'Toyota GR Supra — Satin Orange Color PPF',
        slug: 'toyota-gr-supra-satin-orange-color-ppf',
        service: 'ppf',
        vehicle: { make: 'Toyota', model: 'GR Supra', color: 'Satin Orange' },
        material: 'UNITY USA',
        coverage: 'Full Body',
        finish: 'Satin Orange',
        featured: false,
        order: 3,
        images: [
            { path: 'ppf/color_ppf/emwraps_1746642689_3627424248362649281_5673697168.jpg', alt: 'Toyota GR Supra in satin orange color PPF — full body' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Toyota GR Supra — Satin Orange Color PPF',
            excerpt: 'A complete color change using UNITY USA color PPF on a Toyota GR Supra. This innovative film provides both a stunning satin orange finish and full paint protection in a single application.',
            category: 'project-spotlight',
            relatedService: 'ppf',
            tags: ['Toyota', 'GR Supra', 'Color PPF', 'Satin Orange', 'UNITY USA', 'Full Body'],
            contentFn: (mediaIds) => [
                paragraph('Color PPF is the best of both worlds — a full color change AND paint protection in a single film. This Toyota GR Supra got the complete treatment with UNITY USA\'s satin orange color PPF.'),
                heading('What is Color PPF?'),
                paragraph('Unlike traditional vinyl wraps, color PPF is a true paint protection film with color embedded in the material. This means you get the color-change look of a vinyl wrap with the self-healing, rock chip protection, and longevity of PPF. It\'s thicker, more durable, and comes with a 10-year warranty.'),
                uploadNode(mediaIds[0]),
                heading('The Satin Orange Look'),
                paragraph('The satin orange finish gives the Supra an aggressive, head-turning presence. The satin texture catches light differently than gloss or matte, creating a unique depth that photographs beautifully and turns heads on the road.'),
                heading('Why Choose Color PPF Over Vinyl?'),
                bulletList([
                    'Self-healing technology — scratches disappear with heat',
                    '10-year warranty vs 5-7 years for vinyl',
                    'Superior rock chip and debris protection',
                    'Thicker material for better impact resistance',
                    'No edge lifting or peeling over time',
                ]),
                heading('Book Your Color PPF'),
                paragraph('Color PPF is available in dozens of colors and finishes. Contact EMWRAPS at (206) 383-5328 to explore your options.'),
            ],
        },
    },

    // ── VINYL WRAPS ──
    {
        title: 'Ferrari 296 Challenge — 2025 Race Livery',
        slug: 'ferrari-296-challenge-2025-race-livery',
        service: 'vinyl',
        vehicle: { year: 2025, make: 'Ferrari', model: '296 Challenge', color: 'Custom Livery' },
        material: '3M 2080',
        coverage: 'Full Body',
        finish: 'Custom Livery',
        featured: true,
        order: 1,
        images: [
            { path: 'vinyl_wrap/custom_wrap/race_team/ferrari_296_challenge_2025/ferrari_296_challange_2025_1.PNG', alt: 'Ferrari 296 Challenge 2025 race livery — full car view' },
            { path: 'vinyl_wrap/custom_wrap/race_team/ferrari_296_challenge_2025/ferrari_296_challange_2025_2.PNG', alt: 'Ferrari 296 Challenge 2025 race livery — detail view' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Ferrari 296 Challenge — Custom 2025 Race Livery',
            excerpt: 'A custom 3M 2080 race livery designed and installed for the 2025 Ferrari Challenge season. From concept to paddock in record time.',
            category: 'project-spotlight',
            relatedService: 'vinyl',
            tags: ['Ferrari', '296 Challenge', 'Race Livery', '3M 2080', 'Custom Wrap', 'Motorsport', 'Full Body'],
            contentFn: (mediaIds) => [
                paragraph('When a Ferrari Challenge race team needs a livery that stands out on the grid, they come to EMWRAPS. This 2025 season livery for a Ferrari 296 Challenge was designed, printed, and installed with paddock-side precision.'),
                heading('The Livery Design'),
                paragraph('Working directly with the race team, we created a livery that reflects both the team\'s identity and the aggressive lines of the 296 Challenge. Every sponsor placement was calculated for maximum visibility on track and in broadcast coverage.'),
                uploadNode(mediaIds[0]),
                heading('Race-Ready Installation'),
                paragraph('Race liveries have unique requirements — they need to be installed quickly (sometimes overnight at the track), withstand extreme heat from brakes and exhaust, and survive the physical abuse of wheel-to-wheel racing.'),
                paragraph('We used 3M 2080 cast vinyl for its conformability and durability, ensuring the livery maintained its integrity through an entire season of racing.'),
                uploadNode(mediaIds[1]),
                heading('Trackside Service'),
                paragraph('EMWRAPS provides paddock-side installation services for race teams across the West Coast. Whether it\'s a pre-season full livery or a quick repair between sessions, we bring the shop to the track.'),
                heading('Your Team, Your Livery'),
                paragraph('From club racing to professional series, we design and install race liveries for teams of all levels. Contact EMWRAPS at (206) 383-5328 to discuss your race season.'),
            ],
        },
    },
    {
        title: 'Porsche 911 — 918 Spyder Salzburg Tribute',
        slug: 'porsche-911-salzburg-tribute',
        service: 'vinyl',
        vehicle: { make: 'Porsche', model: '911', color: 'Salzburg Livery' },
        material: '3M 2080',
        coverage: 'Full Body',
        finish: 'Salzburg Livery',
        featured: false,
        order: 5,
        images: [
            { path: 'vinyl_wrap/custom_wrap/911_livery.jpg', alt: 'Porsche 911 with 918 Spyder Salzburg tribute livery' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Porsche 911 — 918 Spyder Salzburg Tribute Livery',
            excerpt: 'A stunning homage to the iconic Porsche Salzburg racing livery, applied to a modern 911 using premium 3M 2080 vinyl.',
            category: 'project-spotlight',
            relatedService: 'vinyl',
            tags: ['Porsche', '911', 'Salzburg', 'Custom Livery', '3M 2080', 'Racing Heritage'],
            contentFn: (mediaIds) => [
                paragraph('The Porsche Salzburg livery is one of the most iconic racing designs in motorsport history. Originally worn by the 917 that won Le Mans in 1970, this red-and-white pattern has become a symbol of Porsche\'s racing DNA.'),
                heading('The Tribute'),
                paragraph('This 911 received a modern interpretation of the Salzburg livery, inspired by the limited-edition 918 Spyder Salzburg package. The client wanted the historic racing aesthetic on their daily-driven 911, creating a unique conversation starter wherever they go.'),
                uploadNode(mediaIds[0]),
                heading('Precision Design & Installation'),
                paragraph('Creating a faithful reproduction of a heritage livery requires meticulous attention to proportions, color matching, and layout. We used 3M 2080 cast vinyl for its superior conformability and color accuracy, ensuring the iconic red and white sections flow naturally along the 911\'s distinctive bodylines.'),
                heading('Commission Your Heritage Livery'),
                paragraph('Whether it\'s Gulf, Martini, Salzburg, or a completely original design — EMWRAPS brings automotive heritage to life. Contact us at (206) 383-5328.'),
            ],
        },
    },
    {
        title: 'Tesla Cybertruck — Dragon Custom Wrap',
        slug: 'tesla-cybertruck-dragon-custom-wrap',
        service: 'vinyl',
        vehicle: { make: 'Tesla', model: 'Cybertruck', color: 'Custom Print' },
        material: '3M 2080',
        coverage: 'Full Body',
        finish: 'Custom Design',
        featured: false,
        order: 6,
        images: [
            { path: 'vinyl_wrap/custom_wrap/Tesla_cybertruck_dragon.jpg', alt: 'Tesla Cybertruck with custom dragon wrap design' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Tesla Cybertruck — Dragon Custom Wrap',
            excerpt: 'A custom-printed dragon design on a Tesla Cybertruck. When the world\'s most futuristic truck meets ancient mythology.',
            category: 'project-spotlight',
            relatedService: 'vinyl',
            tags: ['Tesla', 'Cybertruck', 'Custom Wrap', 'Dragon', 'Printed Wrap', '3M'],
            contentFn: (mediaIds) => [
                paragraph('The Tesla Cybertruck already turns heads with its angular, stainless steel design. But this owner wanted something even more dramatic — a custom-printed dragon design that transforms the Cybertruck into a rolling work of art.'),
                heading('Custom Print Design'),
                paragraph('Our design team created a dragon illustration that flows with the Cybertruck\'s unique angular bodylines. The flat panels of the Cybertruck actually make it an ideal canvas for large-format printed wraps — no complex compound curves to manage.'),
                uploadNode(mediaIds[0]),
                heading('The Installation'),
                paragraph('Wrapping a Cybertruck presents unique challenges. The stainless steel surface requires special surface preparation, and the angular panels need precise alignment to maintain the design\'s flow across panel gaps. Our team executed the install with show-quality precision.'),
                heading('Your Vision, Our Craft'),
                paragraph('Custom printed wraps let you put literally anything on your vehicle. From artwork and photography to abstract designs and brand graphics — if you can dream it, we can wrap it. Contact EMWRAPS at (206) 383-5328.'),
            ],
        },
    },

    // ── ITASHA ──
    {
        title: 'BMW X6M — Neon Genesis Evangelion Full Body',
        slug: 'bmw-x6m-evangelion-itasha',
        service: 'itasha',
        vehicle: { make: 'BMW', model: 'X6M', color: 'Evangelion Unit-01' },
        material: 'Custom Print',
        coverage: 'Full Body',
        finish: 'Evangelion Theme',
        featured: true,
        order: 1,
        images: [
            { path: 'itasha/BMW X6M EVA/emwraps_1736043336_3538510431645470473_5673697168.jpg', alt: 'BMW X6M Evangelion itasha — full car view' },
            { path: 'itasha/BMW X6M EVA/emwraps_1748393613_3642112061850080944_5673697168.jpg', alt: 'BMW X6M Evangelion itasha — detail view' },
            { path: 'itasha/BMW X6M EVA/emwraps_1736043336_3538510431813332795_5673697168.jpg', alt: 'BMW X6M Evangelion itasha — side view' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'BMW X6M — Neon Genesis Evangelion Full Body Itasha',
            excerpt: 'A jaw-dropping full body Evangelion Unit-01 themed itasha build on a BMW X6M. Custom illustrated artwork covering every panel.',
            category: 'project-spotlight',
            relatedService: 'itasha',
            tags: ['BMW', 'X6M', 'Evangelion', 'Itasha', 'Anime Wrap', 'Full Body', 'Unit-01', 'NGE'],
            contentFn: (mediaIds) => [
                paragraph('Neon Genesis Evangelion has been inspiring artists and fans for decades. When this X6M owner came to us with a vision of transforming their BMW into a rolling tribute to NERV\'s iconic Unit-01, we knew it had to be spectacular.'),
                heading('The Design: Unit-01 Comes to Life'),
                paragraph('Every panel of this X6M is covered in custom-illustrated Evangelion artwork. The purple and green color palette of Unit-01, NERV insignias, and dynamic character art come together in a cohesive design that flows with the X6M\'s aggressive bodylines.'),
                uploadNode(mediaIds[0]),
                heading('Full Body Coverage'),
                paragraph('This is a true full-body itasha build — hood, fenders, doors, quarter panels, bumpers, and even the roof. Every angle reveals new details and artwork, making this X6M a showstopper at car meets and anime conventions alike.'),
                uploadNode(mediaIds[1]),
                heading('The Build Process'),
                bulletList([
                    'Custom illustration by our design team',
                    'Vehicle-specific templates for precise fitment',
                    'High-resolution eco-solvent printing on premium vinyl',
                    'Laminated for UV protection and durability',
                    '5-day professional installation',
                ]),
                uploadNode(mediaIds[2]),
                heading('Commission Your Itasha'),
                paragraph('Whether it\'s Evangelion, Demon Slayer, Jujutsu Kaisen, or any other series — we bring your favorite characters to life on your vehicle. Contact EMWRAPS at (206) 383-5328 to start your build.'),
            ],
        },
    },
    {
        title: 'BMW 340i — Hatsune Miku Full Body Wrap',
        slug: 'bmw-340i-hatsune-miku-itasha',
        service: 'itasha',
        vehicle: { make: 'BMW', model: '340i', color: 'Hatsune Miku' },
        material: 'Custom Print',
        coverage: 'Full Body',
        finish: 'Miku Theme',
        featured: false,
        order: 3,
        images: [
            { path: 'itasha/BMW_340i_Miku/emwraps_1763156665_3765953525617718466_5673697168_BME .jpg', alt: 'BMW 340i Hatsune Miku itasha wrap — full car view' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'BMW 340i — Hatsune Miku Full Body Itasha',
            excerpt: 'A vibrant Hatsune Miku themed full body itasha wrap on a BMW 340i. Teal, pink, and digital aesthetics meet German engineering.',
            category: 'project-spotlight',
            relatedService: 'itasha',
            tags: ['BMW', '340i', 'Hatsune Miku', 'Itasha', 'Vocaloid', 'Full Body', 'Anime Wrap'],
            contentFn: (mediaIds) => [
                paragraph('Hatsune Miku — the world\'s most famous virtual pop star — gets the full itasha treatment on this BMW 340i. The iconic teal color palette and digital aesthetic of Miku translates perfectly to automotive art.'),
                heading('The Design'),
                paragraph('Miku\'s signature teal, offset with dynamic poses and digital effects, wraps around the entire 340i. The design captures the energy and vibrance of Miku\'s concerts and music, turning this BMW into a rolling tribute to the Vocaloid phenomenon.'),
                uploadNode(mediaIds[0]),
                heading('Why BMW for Itasha?'),
                paragraph('BMW\'s clean, flowing bodylines make them excellent canvases for itasha builds. The 340i\'s proportions — long hood, short deck, wide stance — provide the perfect blank slate for large-format character artwork.'),
                heading('Start Your Miku Build'),
                paragraph('Contact EMWRAPS at (206) 383-5328 to commission your Vocaloid itasha build.'),
            ],
        },
    },
    {
        title: 'Toyota GR Supra — Death Note Livery',
        slug: 'toyota-gr-supra-death-note-itasha',
        service: 'itasha',
        vehicle: { make: 'Toyota', model: 'GR Supra', color: 'Death Note' },
        material: 'Custom Print',
        coverage: 'Full Body',
        finish: 'Race Livery',
        featured: false,
        order: 4,
        images: [
            { path: 'itasha/GR Supra_death_note/emwraps_1750442316_3659297835565452809_5673697168.jpg', alt: 'Toyota GR Supra Death Note livery — Misa Amane design' },
            { path: 'itasha/GR Supra_death_note/emwraps_1750442316_3659297835565702954_5673697168.jpg', alt: 'Toyota GR Supra Death Note — rear detail' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Toyota GR Supra — Death Note Misa Amane Livery',
            excerpt: 'A dark, stunning Death Note themed itasha livery on a Toyota GR Supra featuring Misa Amane. Gothic anime aesthetics meet JDM sports car perfection.',
            category: 'project-spotlight',
            relatedService: 'itasha',
            tags: ['Toyota', 'GR Supra', 'Death Note', 'Misa Amane', 'Itasha', 'Anime Wrap', 'Livery'],
            contentFn: (mediaIds) => [
                paragraph('Death Note is one of anime\'s most iconic psychological thrillers, and Misa Amane is one of its most visually striking characters. This GR Supra brings the dark, gothic energy of Death Note to life on one of Japan\'s most legendary sports car nameplates.'),
                heading('The Design: Gothic Meets JDM'),
                paragraph('The livery features Misa Amane in her iconic gothic lolita outfit, set against dark tones with Death Note typography and symbols. The race livery format adds dynamic lines and sponsor-style placements that give it an authentic motorsport feel.'),
                uploadNode(mediaIds[0]),
                heading('Supra × Anime: A Natural Pairing'),
                paragraph('The Toyota GR Supra is a pillar of JDM culture, making it the perfect canvas for anime-inspired builds. Its flowing bodylines and aggressive stance complement character artwork beautifully.'),
                uploadNode(mediaIds[1]),
                heading('Commission Your Build'),
                paragraph('From shonen action series to slice-of-life aesthetics, we create itasha builds for every genre. Contact EMWRAPS at (206) 383-5328.'),
            ],
        },
    },
    {
        title: 'Honda Motocompacto — Hello Kitty & Friends',
        slug: 'honda-motocompacto-hello-kitty',
        service: 'itasha',
        vehicle: { make: 'Honda', model: 'Motocompacto', color: 'Hello Kitty' },
        material: 'Custom Print',
        coverage: 'Full Body',
        finish: 'Custom Print',
        featured: false,
        order: 5,
        images: [
            { path: 'itasha/Honda Motocompacto_Hello_kitty/emwraps_1752646257_3677785826268986072_5673697168.jpg', alt: 'Honda Motocompacto with Hello Kitty custom wrap' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Honda Motocompacto — Hello Kitty & Friends Custom Wrap',
            excerpt: 'The cutest build in our portfolio — a Honda Motocompacto electric scooter wrapped in a custom Hello Kitty & Friends design.',
            category: 'project-spotlight',
            relatedService: 'itasha',
            tags: ['Honda', 'Motocompacto', 'Hello Kitty', 'Sanrio', 'Custom Wrap', 'Electric Scooter'],
            contentFn: (mediaIds) => [
                paragraph('Who says itasha has to be on a car? This Honda Motocompacto — Honda\'s innovative folding electric scooter — got the full Hello Kitty & Friends treatment, proving that any vehicle can become a canvas for character art.'),
                heading('The Design'),
                paragraph('The compact body panels of the Motocompacto create the perfect canvas for Sanrio\'s beloved characters. Hello Kitty, My Melody, and friends cover every surface in a riot of pink, white, and pastel colors.'),
                uploadNode(mediaIds[0]),
                heading('Small Vehicle, Big Personality'),
                paragraph('This build proves that vehicle size doesn\'t limit creativity. Whether it\'s a hypercar or a folding scooter, EMWRAPS brings the same level of design quality and installation precision to every project.'),
                heading('Wrap Any Vehicle'),
                paragraph('Motorcycles, scooters, ATVs, golf carts — if it has a surface, we can wrap it. Contact EMWRAPS at (206) 383-5328.'),
            ],
        },
    },
    {
        title: 'Nissan S13 — outXlove Custom Itasha',
        slug: 'nissan-s13-outxlove-itasha',
        service: 'itasha',
        vehicle: { make: 'Nissan', model: 'S13', color: 'Custom' },
        material: 'Custom Print',
        coverage: 'Full Body',
        finish: 'Livery',
        featured: false,
        order: 6,
        images: [
            { path: 'itasha/Nissan S13_outXlove/emwraps_1745983153_3621891662055537961_5673697168 (1).jpg', alt: 'Nissan S13 with outXlove custom itasha livery' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Nissan S13 — outXlove Custom Itasha Build',
            excerpt: 'A custom outXlove itasha livery on a classic Nissan S13, blending JDM drift culture with anime-inspired artwork.',
            category: 'project-spotlight',
            relatedService: 'itasha',
            tags: ['Nissan', 'S13', 'outXlove', 'Itasha', 'JDM', 'Drift', 'Custom Wrap'],
            contentFn: (mediaIds) => [
                paragraph('The Nissan S13 is a legend of JDM drift culture. This build takes that heritage and fuses it with custom anime-inspired artwork from outXlove, creating a car that\'s equally at home at car meets and drift events.'),
                heading('JDM Meets Anime'),
                uploadNode(mediaIds[0]),
                paragraph('The S13\'s classic proportions and pop-up headlights provide a nostalgic canvas for modern character art. The outXlove designs blend seamlessly with the car\'s drift-ready stance and modified aero.'),
                heading('Build Yours'),
                paragraph('Have a classic JDM car that deserves an itasha build? Contact EMWRAPS at (206) 383-5328 — we love working on S-chassis, AE86s, RX-7s, and all the icons of Japanese automotive culture.'),
            ],
        },
    },
    {
        title: 'Xue Hu — Custom Anime Hood Wrap',
        slug: 'xue-hu-custom-anime-hood-wrap',
        service: 'itasha',
        vehicle: { make: 'Custom', model: 'Build', color: 'Custom' },
        material: 'Custom Print',
        coverage: 'Hood',
        finish: 'Anime Art',
        featured: false,
        order: 7,
        images: [
            { path: 'itasha/Xue Hu/emwraps_1722489217_3424810241727353215_5673697168.jpg', alt: 'Xue Hu custom anime hood wrap' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Xue Hu — Custom Anime Hood Wrap',
            excerpt: 'A gorgeous custom anime hood wrap featuring original Xue Hu artwork. Proof that even a partial wrap can make a massive visual impact.',
            category: 'project-spotlight',
            relatedService: 'itasha',
            tags: ['Anime', 'Hood Wrap', 'Xue Hu', 'Custom Art', 'Itasha', 'Partial Wrap'],
            contentFn: (mediaIds) => [
                paragraph('Not every itasha has to be a full-body build. This custom anime hood wrap featuring Xue Hu artwork proves that a focused, well-executed partial wrap can be just as impactful as a full car wrap.'),
                heading('The Artwork'),
                uploadNode(mediaIds[0]),
                paragraph('The hood is often the most visible panel on any vehicle, making it the ideal location for a statement piece. The Xue Hu illustration features vibrant colors and intricate details that draw the eye from any angle.'),
                heading('Partial Wraps: Accessible Itasha'),
                paragraph('Hood wraps are a great entry point into the world of itasha. Starting from $800-$1,500, they deliver maximum visual impact at a fraction of the cost of a full-body build. Perfect for enthusiasts who want to express their anime fandom without committing to a complete wrap.'),
                heading('Start Small, Dream Big'),
                paragraph('Contact EMWRAPS at (206) 383-5328 to start with a hood wrap and work your way up to a full build.'),
            ],
        },
    },

    // ── FLEET ──
    {
        title: 'United Signature — Fleet Van Wrap',
        slug: 'united-signature-fleet-van-wrap',
        service: 'fleet',
        vehicle: { make: 'Ford', model: 'Transit', color: 'Custom Branded' },
        material: '3M IJ180Cv3',
        coverage: 'Full Wrap',
        finish: 'Printed Graphics',
        featured: true,
        order: 1,
        images: [
            { path: 'fleet_wrap/fleet_van_main.jpg', alt: 'United Signature fleet van — full wrap' },
            { path: 'fleet_wrap/fleet_van_detail.jpg', alt: 'United Signature fleet van — detail view' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'United Signature — Commercial Fleet Van Wrap',
            excerpt: 'A professional fleet wrap for United Signature\'s commercial vans. Custom designed, printed, and installed for maximum brand visibility on the road.',
            category: 'project-spotlight',
            relatedService: 'fleet',
            tags: ['Fleet Wrap', 'Commercial', 'Van Wrap', 'United Signature', 'Ford Transit', '3M', 'Branding'],
            contentFn: (mediaIds) => [
                paragraph('When United Signature needed their fleet vehicles to make a strong brand impression, they turned to EMWRAPS. This fleet wrap project demonstrates how professional vehicle branding transforms ordinary work vans into powerful mobile marketing tools.'),
                heading('The Design'),
                paragraph('We worked closely with United Signature to develop a wrap design that communicates their brand values — professionalism, reliability, and quality service. The design includes their logo, contact information, and service descriptions, all laid out for maximum readability at a distance.'),
                uploadNode(mediaIds[0]),
                heading('Fleet Consistency'),
                paragraph('For multi-vehicle fleets, brand consistency is critical. Every van in the fleet receives identical wraps, ensuring a unified brand presence across the Seattle area.'),
                uploadNode(mediaIds[1]),
                heading('The ROI of Fleet Wraps'),
                bulletList([
                    '30,000-70,000 daily impressions per vehicle',
                    'Lowest cost-per-impression of any advertising medium',
                    'One-time investment with 5-7 year lifespan',
                    'Protects factory paint, preserving resale value',
                    'Generates leads 24/7, even when parked',
                ]),
                heading('Wrap Your Fleet'),
                paragraph('Volume discounts available for fleets of 3+ vehicles. Contact EMWRAPS at (206) 383-5328 for a free fleet consultation.'),
            ],
        },
    },

    // ── AFTERMARKET ──
    {
        title: 'Lamborghini Urus — Wild Bodykit Installation',
        slug: 'lamborghini-urus-wild-bodykit',
        service: 'aftermarket',
        vehicle: { make: 'Lamborghini', model: 'Urus', color: 'Black' },
        material: 'Wide Body Kit',
        coverage: 'Full Body Kit',
        finish: 'Satin Black',
        featured: true,
        order: 1,
        images: [
            { path: 'parts/Lamborghini Urus wild bodykit install/emwraps_1712347226_3339733056884709437_5673697168.jpg', alt: 'Lamborghini Urus with wild bodykit — front view' },
            { path: 'parts/Lamborghini Urus wild bodykit install/emwraps_1712347226_3339733056884768280_5673697168.jpg', alt: 'Lamborghini Urus wild bodykit — detail view' },
            { path: 'parts/Lamborghini Urus wild bodykit install/emwraps_1712347226_3339733056884727739_5673697168.jpg', alt: 'Lamborghini Urus wild bodykit — side view' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Lamborghini Urus — Wild Wide Body Kit Installation',
            excerpt: 'A jaw-dropping wide body kit transformation on a Lamborghini Urus. Aggressive fender flares, custom bumpers, and a commanding road presence.',
            category: 'project-spotlight',
            relatedService: 'aftermarket',
            tags: ['Lamborghini', 'Urus', 'Body Kit', 'Wide Body', 'Aftermarket', 'Installation'],
            contentFn: (mediaIds) => [
                paragraph('The Lamborghini Urus is already one of the most aggressive-looking SUVs on the planet. But for some owners, factory aggressive isn\'t enough. This wild wide body kit takes the Urus to an entirely new level of road presence.'),
                heading('The Kit'),
                paragraph('This wide body kit includes widened fender flares all around, a custom front bumper with enlarged air intakes, side skirts, and a rear diffuser. Every component was test-fitted and carefully aligned to maintain the Urus\'s striking proportions while adding dramatic width to the stance.'),
                uploadNode(mediaIds[0]),
                heading('Precision Installation'),
                paragraph('Wide body kit installation on an exotic vehicle requires surgical precision. Our team took 4 days to complete this build, ensuring every panel gap was consistent, every fastener was torqued to spec, and the overall fitment meets our exacting standards.'),
                uploadNode(mediaIds[1]),
                heading('The Transformation'),
                paragraph('The before-and-after on this Urus is dramatic. The added width, combined with the aggressive aero elements, transforms the silhouette from luxury SUV to street-legal race machine.'),
                uploadNode(mediaIds[2]),
                heading('Your Urus, Upgraded'),
                paragraph('Contact EMWRAPS at (206) 383-5328 to discuss your Urus or any exotic vehicle aftermarket build.'),
            ],
        },
    },
    {
        title: 'Audi RS6 — 1016 Industries Full Carbon Kit',
        slug: 'audi-rs6-1016-industries-carbon-kit',
        service: 'aftermarket',
        vehicle: { make: 'Audi', model: 'RS6', color: 'Grey' },
        material: 'Carbon Fiber',
        coverage: 'Full Aero Kit',
        finish: 'Carbon Fiber',
        featured: false,
        order: 2,
        images: [
            { path: 'parts/Audi_RS6_1016 Industries_full_carbon_kit/emwraps_1712426266_3340396086279030337_5673697168.jpg', alt: 'Audi RS6 with 1016 Industries full carbon fiber aero kit' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Audi RS6 — 1016 Industries Full Carbon Fiber Kit',
            excerpt: 'A complete 1016 Industries carbon fiber aerodynamic kit installed on an Audi RS6 Avant. Motorsport-grade components on the ultimate super wagon.',
            category: 'project-spotlight',
            relatedService: 'aftermarket',
            tags: ['Audi', 'RS6', '1016 Industries', 'Carbon Fiber', 'Aftermarket', 'Aero Kit'],
            contentFn: (mediaIds) => [
                paragraph('The Audi RS6 Avant is the quintessential super wagon — 621 horsepower in a practical estate body. But with a full 1016 Industries carbon fiber kit, it becomes something truly extraordinary.'),
                heading('1016 Industries: The Gold Standard'),
                paragraph('1016 Industries is known for producing some of the finest carbon fiber components in the aftermarket industry. Their RS6 kit includes a front lip, side skirts, rear diffuser, rear spoiler, and mirror caps — all in hand-laid carbon fiber with a perfect weave pattern.'),
                uploadNode(mediaIds[0]),
                heading('Carbon Fiber Craftsmanship'),
                paragraph('Every 1016 Industries component is made from aerospace-grade pre-preg carbon fiber, hand-laid in an autoclave. The result is lightweight, incredibly strong, and visually stunning — with a deep, glossy carbon weave that catches light beautifully.'),
                heading('Professional Installation'),
                paragraph('Carbon fiber components require careful handling and precise fitment. Our team ensures every piece is aligned perfectly and securely mounted. No shortcuts, no compromise.'),
                heading('Upgrade Your RS6'),
                paragraph('We work with 1016 Industries, Vorsteiner, MANSORY, and other premium aftermarket brands. Contact EMWRAPS at (206) 383-5328.'),
            ],
        },
    },
    {
        title: 'Ferrari F8 — 1016 Industries Aero Kit',
        slug: 'ferrari-f8-1016-industries-aero-kit',
        service: 'aftermarket',
        vehicle: { make: 'Ferrari', model: 'F8 Tributo', color: 'Red' },
        material: 'Carbon Fiber',
        coverage: 'Full Aero Kit',
        finish: 'Carbon Aero',
        featured: false,
        order: 3,
        images: [
            { path: 'parts/ferrari_f8_1016_bodykit_install/ferrari_f8.jpg', alt: 'Ferrari F8 Tributo with 1016 Industries carbon aero kit' },
        ],
        mainImageIdx: 0,
        blog: {
            title: 'Ferrari F8 Tributo — 1016 Industries Carbon Aero Kit',
            excerpt: 'A stunning 1016 Industries carbon fiber aerodynamic kit on a Ferrari F8 Tributo. Race-inspired components that elevate Ferrari\'s V8 masterpiece.',
            category: 'project-spotlight',
            relatedService: 'aftermarket',
            tags: ['Ferrari', 'F8 Tributo', '1016 Industries', 'Carbon Fiber', 'Aftermarket', 'Aero Kit'],
            contentFn: (mediaIds) => [
                paragraph('The Ferrari F8 Tributo represents the pinnacle of Ferrari\'s twin-turbo V8 lineage — 710 horsepower in a mid-engine package that\'s both beautiful and brutally fast. This 1016 Industries carbon aero kit adds a motorsport edge without detracting from the F8\'s elegant design.'),
                heading('The 1016 Treatment'),
                paragraph('The aero package includes carbon fiber front splitter, side blades, rear diffuser, and engine cover components. Each piece is designed to complement the F8\'s aerodynamic profile while adding visual drama.'),
                uploadNode(mediaIds[0]),
                heading('Exotic Installation Expertise'),
                paragraph('Installing aftermarket components on a Ferrari requires specialized knowledge and tools. Our team has experience with all major Ferrari models and understands the specific requirements of working on these precision machines.'),
                heading('Upgrade Your Ferrari'),
                paragraph('From 296 GTB to SF90 Stradale, we handle aftermarket installations across the entire Ferrari lineup. Contact EMWRAPS at (206) 383-5328.'),
            ],
        },
    },
];

// ──────────────────────────────────────────────────
// MAIN MIGRATION
// ──────────────────────────────────────────────────

async function main() {
    await login();

    // Get category IDs
    const projectSpotlightId = await getCategoryId('project-spotlight');
    console.log(`📂 Category "project-spotlight": ID ${projectSpotlightId}`);

    const results = { projects: 0, posts: 0, media: 0, errors: [] };

    for (const project of PROJECTS) {
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`🚗 ${project.title}`);
        console.log(`${'═'.repeat(60)}`);

        // 1. Upload images
        const mediaIds = [];
        const mediaDocs = [];
        for (const img of project.images) {
            const imgPath = path.join(FRONTEND_PUBLIC, 'img', img.path);
            if (!fs.existsSync(imgPath)) {
                console.error(`  ⚠️  Image not found: ${imgPath}`);
                results.errors.push(`Missing: ${img.path}`);
                continue;
            }
            const doc = await uploadMedia(imgPath, img.alt);
            if (doc) {
                mediaIds.push(doc.id);
                mediaDocs.push(doc);
                results.media++;
            }
            // Small delay to avoid overwhelming the server
            await new Promise(r => setTimeout(r, 500));
        }

        if (mediaIds.length === 0) {
            console.error(`  ❌ No images uploaded, skipping project`);
            results.errors.push(`No images for: ${project.title}`);
            continue;
        }

        // 2. Create Project entry
        const projectData = {
            title: project.title,
            slug: project.slug,
            description: project.blog.excerpt,
            vehicle: project.vehicle,
            service: project.service,
            material: project.material,
            coverage: project.coverage,
            finish: project.finish,
            featured: project.featured,
            order: project.order,
            images: mediaIds.map((id, i) => ({
                image: id,
                label: project.images[i]?.alt?.split('—').pop()?.trim() || '',
            })),
            completedAt: new Date().toISOString(),
        };

        const projectDoc = await createProject(projectData);
        if (projectDoc) results.projects++;

        // 3. Create Blog Post
        const blogContent = project.blog.contentFn(mediaIds);
        const postData = {
            title: project.blog.title,
            slug: project.slug,
            excerpt: project.blog.excerpt,
            status: 'published',
            _status: 'published',
            publishedAt: new Date().toISOString(),
            category: projectSpotlightId,
            relatedService: project.blog.relatedService,
            author: 1,
            featuredImage: mediaIds[project.mainImageIdx] || mediaIds[0],
            content: lexicalRoot(blogContent),
            tags: project.blog.tags.map(tag => ({ tag })),
        };

        const postDoc = await createPost(postData);
        if (postDoc) results.posts++;

        // Small delay between projects
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 Migration Summary');
    console.log(`${'═'.repeat(60)}`);
    console.log(`  📸 Media uploaded: ${results.media}`);
    console.log(`  🏗️  Projects created: ${results.projects}`);
    console.log(`  📝 Blog posts created: ${results.posts}`);
    if (results.errors.length > 0) {
        console.log(`  ⚠️  Errors: ${results.errors.length}`);
        results.errors.forEach(e => console.log(`     - ${e}`));
    }
    console.log(`\n✅ Migration complete!`);
}

main().catch(console.error);
