/**
 * Seed Team Members and Promotions into CMS
 * Usage: node seed-team-promos.mjs
 *
 * Requires CMS to be running at CMS_URL (defaults to http://localhost:3001)
 * and valid admin credentials.
 */

const CMS_URL = process.env.CMS_URL || 'http://localhost:3001'
const EMAIL = process.env.CMS_EMAIL || 'ethan@emwraps.net'
const PASSWORD = process.env.CMS_PASSWORD || 'admin123'

async function login() {
    const res = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    })
    const data = await res.json()
    if (!data.token) throw new Error('Login failed — check credentials')
    console.log('✅ Logged in as', data.user?.email)
    return data.token
}

async function createDoc(collection, doc, token) {
    const res = await fetch(`${CMS_URL}/api/${collection}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
        },
        body: JSON.stringify(doc),
    })
    const data = await res.json()
    if (data.errors) {
        console.error(`  ❌ ${doc.name || doc.title}:`, data.errors?.[0]?.message || data.errors)
        return null
    }
    console.log(`  ✅ ${doc.name || doc.title}`)
    return data.doc
}

const teamMembers = [
    {
        name: 'Ethan C.',
        role: 'Owner & Lead Installer',
        bio: 'Founded EMWRAPS with a passion for automotive customization. Over 8 years of experience in vinyl wraps, PPF, and ceramic coating. Certified by 3M and XPEL.',
        specialties: ['vinyl', 'ppf', 'ceramic', 'aftermarket'],
        certifications: [
            { name: '3M Certified Installer', year: 2019 },
            { name: 'XPEL Certified', year: 2020 },
        ],
        yearsExperience: 8,
        social: { instagram: 'https://instagram.com/emwraps' },
        order: 1,
        active: true,
    },
    {
        name: 'Alex M.',
        role: 'Senior Wrapper',
        bio: 'Specializes in color change wraps and complex body lines. Known for flawless installs on exotic vehicles including Lamborghini, Ferrari, and McLaren.',
        specialties: ['vinyl', 'ppf', 'fleet'],
        certifications: [
            { name: 'Avery Dennison Certified', year: 2021 },
        ],
        yearsExperience: 6,
        order: 2,
        active: true,
    },
    {
        name: 'Kevin L.',
        role: 'PPF Specialist',
        bio: 'Detail-oriented specialist focused exclusively on paint protection film. Handles high-end vehicles requiring precision cut and seamless edges.',
        specialties: ['ppf', 'ceramic'],
        certifications: [
            { name: 'XPEL Certified', year: 2022 },
            { name: 'SunTek Certified', year: 2021 },
        ],
        yearsExperience: 5,
        order: 3,
        active: true,
    },
    {
        name: 'Sarah T.',
        role: 'Design Specialist',
        bio: 'Creates custom designs for itasha wraps, partial wraps, and fleet branding. Expert in vinyl printing and large-format graphics.',
        specialties: ['itasha', 'design', 'fleet'],
        yearsExperience: 4,
        order: 4,
        active: true,
    },
]

const promotions = [
    {
        title: 'Spring Protection Package',
        slug: 'spring-protection-2026',
        type: 'package',
        shortDescription: '15% off Full Body PPF + Ceramic Coating bundle — protect your ride this spring!',
        discount: { type: 'percentage', value: 15 },
        applicableServices: ['ppf', 'ceramic'],
        startDate: '2026-03-01T00:00:00.000Z',
        endDate: '2026-05-31T23:59:59.000Z',
        ctaText: 'Get Quote',
        ctaLink: '/booking',
        active: true,
        showOnHomepage: true,
        priority: 10,
    },
    {
        title: 'Fleet Wrap Discount',
        slug: 'fleet-wrap-discount',
        type: 'discount',
        shortDescription: 'Book 3+ vehicles for fleet wrap and get 10% off total — branding that moves with your business.',
        discount: { type: 'percentage', value: 10, code: 'FLEET10' },
        applicableServices: ['fleet'],
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-12-31T23:59:59.000Z',
        ctaText: 'Contact Us',
        ctaLink: '/contact',
        active: true,
        showOnHomepage: false,
        priority: 5,
    },
    {
        title: 'Referral Reward',
        slug: 'referral-reward',
        type: 'referral',
        shortDescription: 'Refer a friend and both get $100 off your next wrap service!',
        discount: { type: 'fixed', value: 100 },
        applicableServices: ['all'],
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-12-31T23:59:59.000Z',
        ctaText: 'Learn More',
        ctaLink: '/contact',
        active: true,
        showOnHomepage: false,
        priority: 3,
    },
]

async function main() {
    console.log(`\n🔌 Connecting to CMS at ${CMS_URL}\n`)
    const token = await login()

    console.log('\n👥 Seeding Team Members...')
    for (const member of teamMembers) {
        await createDoc('team-members', member, token)
    }

    console.log('\n🎉 Seeding Promotions...')
    for (const promo of promotions) {
        await createDoc('promotions', promo, token)
    }

    console.log('\n✅ Done! Check your CMS at', CMS_URL)
}

main().catch(console.error)
