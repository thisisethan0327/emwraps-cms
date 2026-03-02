/**
 * EMWRAPS SEO Optimization Script
 * 
 * Populates the Payload SEO plugin fields (meta.title, meta.description, meta.image)
 * on all existing posts and projects with geo-optimized, keyword-rich SEO content.
 */

const CMS_URL = 'http://localhost:3001';
const CREDENTIALS = { email: 'admin@emwraps.net', password: '@Emem98134' };

let TOKEN = '';

async function login() {
    const res = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CREDENTIALS),
    });
    const data = await res.json();
    TOKEN = data.token;
    console.log('✅ Logged in');
}

async function updateDoc(collection, id, payload) {
    const res = await fetch(`${CMS_URL}/api/${collection}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${TOKEN}`,
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.doc) {
        console.log(`  ✅ Updated ${collection}/${id}: "${data.doc.title || data.doc.name}"`);
        return data.doc;
    }
    console.error(`  ❌ Failed ${collection}/${id}:`, data.errors?.[0]?.message || data.message);
    return null;
}

async function getAllDocs(collection, depth = 2) {
    const res = await fetch(`${CMS_URL}/api/${collection}?limit=100&depth=${depth}`, {
        headers: { 'Authorization': `JWT ${TOKEN}` },
    });
    const data = await res.json();
    return data.docs || [];
}

// ── Service slug → display name mapping ──
const SERVICE_NAMES = {
    ppf: 'Paint Protection Film (PPF)',
    vinyl: 'Vinyl Wrap',
    itasha: 'Itasha / Anime Wrap',
    fleet: 'Fleet Wrap',
    ceramic: 'Ceramic Coating',
    aftermarket: 'Aftermarket Installation',
};

// ── Seattle geo keywords ──
const GEO_KEYWORDS = [
    'Seattle WA', 'Bellevue', 'Tacoma', 'Redmond', 'Kirkland',
    'Renton', 'Everett', 'Kent', 'Lynnwood', 'Issaquah',
];

function generatePostSEO(post) {
    const title = post.title || '';
    const service = SERVICE_NAMES[post.relatedService] || '';
    const category = typeof post.category === 'object' ? post.category?.name : '';
    const tags = (post.tags || []).map(t => t.tag).filter(Boolean);
    const excerpt = post.excerpt || '';

    // Generate SEO title (max ~60 chars for Google)
    let seoTitle = `${title} — EMWRAPS | Seattle ${service || 'Vehicle Wraps'}`;
    if (seoTitle.length > 70) {
        seoTitle = `${title} — EMWRAPS Seattle`;
    }
    if (seoTitle.length > 70) {
        seoTitle = `${title} | EMWRAPS`;
    }

    // Generate meta description (max ~155 chars for Google)
    let seoDesc = excerpt;
    if (!seoDesc.includes('Seattle') && !seoDesc.includes('EMWRAPS')) {
        const serviceSuffix = service ? ` Professional ${service.toLowerCase()} in Seattle, WA.` : ' By EMWRAPS, Seattle\'s premier vehicle wrap shop.';
        if ((seoDesc + serviceSuffix).length <= 160) {
            seoDesc += serviceSuffix;
        }
    }
    if (seoDesc.length > 160) {
        seoDesc = seoDesc.substring(0, 157) + '...';
    }

    // Generate keyword-rich content summary for search
    const geoKeywords = GEO_KEYWORDS.slice(0, 3).join(', ');
    const serviceKeywords = service ? `${service}, ` : '';
    const tagKeywords = tags.slice(0, 5).join(', ');

    return {
        meta: {
            title: seoTitle,
            description: seoDesc,
            image: typeof post.featuredImage === 'object' ? post.featuredImage.id : post.featuredImage,
        },
    };
}

function generateProjectSEO(project) {
    const title = project.title || '';
    const service = SERVICE_NAMES[project.service] || '';
    const vehicle = project.vehicle;
    const vehicleName = [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(' ');
    const desc = project.description || '';

    let seoTitle = `${title} — EMWRAPS | Seattle ${service}`;
    if (seoTitle.length > 70) seoTitle = `${title} | EMWRAPS Seattle`;
    if (seoTitle.length > 70) seoTitle = `${title} | EMWRAPS`;

    let seoDesc = desc;
    if (!seoDesc.includes('Seattle')) {
        const suffix = ` Professional ${service.toLowerCase()} in Seattle, WA by EMWRAPS.`;
        if ((seoDesc + suffix).length <= 160) {
            seoDesc += suffix;
        }
    }
    if (seoDesc.length > 160) seoDesc = seoDesc.substring(0, 157) + '...';

    return {
        meta: {
            title: seoTitle,
            description: seoDesc,
            image: project.images?.[0]?.image?.id || project.images?.[0]?.image || null,
        },
    };
}

// ──────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────

async function main() {
    await login();

    // ── Update Posts ──
    console.log('\n📝 Updating blog post SEO...');
    const posts = await getAllDocs('posts');
    console.log(`   Found ${posts.length} posts`);

    for (const post of posts) {
        const seo = generatePostSEO(post);
        await updateDoc('posts', post.id, seo);
        await new Promise(r => setTimeout(r, 300));
    }

    // ── Update Projects ──
    console.log('\n🏗️  Updating project SEO...');
    const projects = await getAllDocs('projects');
    console.log(`   Found ${projects.length} projects`);

    for (const project of projects) {
        const seo = generateProjectSEO(project);
        await updateDoc('projects', project.id, seo);
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n✅ SEO optimization complete!');
    console.log(`   📝 ${posts.length} posts updated`);
    console.log(`   🏗️  ${projects.length} projects updated`);
}

main().catch(console.error);
