/**
 * EMWRAPS CMS Seed Script
 * Seeds the Payload CMS with initial business data.
 * Run: node seed.mjs
 */

const CMS_URL = 'http://localhost:3001';

// Login credentials
const EMAIL = 'admin@emwraps.net';
const PASSWORD = '@Emem98134';

let token = '';

// ── Auth ──
async function login() {
    const res = await fetch(`${CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const data = await res.json();
    token = data.token;
    console.log('✅ Logged in as', data.user?.email);
}

async function api(endpoint, body) {
    const res = await fetch(`${CMS_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.errors) {
        console.error(`  ❌ ${endpoint}:`, data.errors[0]?.message || data.errors);
        return null;
    }
    return data.doc || data;
}

async function apiUpdate(endpoint, body) {
    const res = await fetch(`${CMS_URL}/api/${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.errors) {
        console.error(`  ❌ ${endpoint}:`, data.errors[0]?.message || data.errors);
        return null;
    }
    return data.result || data;
}

// ── Seed Categories ──
async function seedCategories() {
    console.log('\n📁 Seeding Categories...');
    const cats = [
        { name: 'Project Spotlight', slug: 'project-spotlight', description: 'In-depth looks at our featured builds and transformations' },
        { name: 'Tips & Guides', slug: 'tips-guides', description: 'Expert advice on vinyl wraps, PPF, ceramic coatings, and vehicle care' },
        { name: 'Industry News', slug: 'industry-news', description: 'Latest trends and innovations in the vehicle customization industry' },
        { name: 'Behind the Scenes', slug: 'behind-the-scenes', description: 'Inside the EMWRAPS shop — our process, team, and culture' },
        { name: 'Customer Stories', slug: 'customer-stories', description: 'Real stories from our clients about their wrap experience' },
    ];
    for (const cat of cats) {
        const result = await api('categories', cat);
        if (result) console.log(`  ✅ Category: ${cat.name}`);
    }
}

// ── Seed FAQs ──
async function seedFAQs() {
    console.log('\n❓ Seeding FAQs...');
    const faqs = [
        // Vinyl
        { question: 'How long does a vinyl wrap last?', answer: 'A professionally installed vinyl wrap typically lasts 5–7 years. With proper care (hand washing, garage parking), some wraps can maintain their look even longer. We only use premium cast films from 3M and Avery Dennison.', page: 'vinyl', order: 1 },
        { question: 'Will a wrap damage my paint?', answer: 'No. When professionally removed, vinyl wraps actually protect the underlying paint. Your factory paint will be preserved in the condition it was in before wrapping. In fact, many owners use wraps specifically to protect their OEM finish.', page: 'vinyl', order: 2 },
        { question: 'How long does the installation take?', answer: 'A full color change wrap typically takes 3–5 business days. Custom designs with printed graphics may take longer depending on complexity. Partial wraps can often be completed in 1–2 days.', page: 'vinyl', order: 3 },
        { question: 'Can I wrap a leased vehicle?', answer: 'Absolutely. Vinyl wraps are fully removable, making them perfect for leased vehicles. You can customize your ride and return it to factory condition before turning it in.', page: 'vinyl', order: 4 },
        { question: 'Do you offer race team trackside wrapping?', answer: 'Yes. We provide paddock-side installation services for race teams. We\'ve wrapped Ferrari Challenge cars at events across the West Coast with race-day turnaround times.', page: 'vinyl', order: 5 },

        // PPF
        { question: 'What is PPF (Paint Protection Film)?', answer: 'PPF is a clear, thermoplastic urethane film applied to painted surfaces to protect against rock chips, scratches, bug acids, and UV damage. It\'s virtually invisible and self-healing.', page: 'ppf', order: 1 },
        { question: 'How long does PPF last?', answer: 'Premium PPF from brands like XPEL and 3M can last 7–10 years with proper care. Most come with manufacturer warranties. The film protects your paint while maintaining its original look.', page: 'ppf', order: 2 },
        { question: 'Does PPF really self-heal?', answer: 'Yes! Modern PPF has a thermoplastic polyurethane top coat that allows minor scratches and swirl marks to disappear with heat — either from the sun, warm water, or a heat gun.', page: 'ppf', order: 3 },
        { question: 'Full body or partial PPF — which is better?', answer: 'It depends on your needs and budget. Full front (hood, fenders, bumper) covers the most vulnerable areas. Full body provides complete protection and is ideal for high-value or track-driven vehicles.', page: 'ppf', order: 4 },
        { question: 'Can PPF be applied over vinyl wrap?', answer: 'Generally no. PPF should be applied directly to clean, factory or high-quality painted surfaces. However, we can apply PPF first, then vinyl on top for a layered protection + style approach.', page: 'ppf', order: 5 },

        // Itasha
        { question: 'What is itasha?', answer: 'Itasha (痛車) is a Japanese car culture trend of decorating vehicles with character art from anime, manga, or video games. It\'s a bold expression of fandom culture through professional-grade vinyl wraps.', page: 'itasha', order: 1 },
        { question: 'Can you design custom itasha wraps?', answer: 'Yes! Our design team specializes in creating original itasha artwork. We can work from your reference images, character preferences, or create a fully custom design from scratch.', page: 'itasha', order: 2 },
        { question: 'Do you work with licensed artwork?', answer: 'We encourage customers to provide their own licensed art or commission artists directly. We can also connect you with talented illustrators who specialize in anime-style vehicle art.', page: 'itasha', order: 3 },
        { question: 'How much does an itasha wrap cost?', answer: 'Itasha wraps vary based on vehicle size, design complexity, and coverage area. Full body itasha wraps typically start from $4,000–$6,000+. Contact us for a custom quote based on your vision.', page: 'itasha', order: 4 },

        // Fleet
        { question: 'What types of vehicles can you wrap for fleets?', answer: 'We wrap all fleet vehicle types: vans, trucks, trailers, box trucks, sedans, and SUVs. From simple logo decals to full custom wraps, we handle fleets of any size.', page: 'fleet', order: 1 },
        { question: 'Do you offer volume discounts for fleets?', answer: 'Yes. We offer tiered pricing for fleet wraps — the more vehicles, the better the per-unit price. Contact us for a custom fleet quote.', page: 'fleet', order: 2 },
        { question: 'How long do fleet wraps last?', answer: 'Fleet wraps typically last 3–7 years depending on the type of wrap material and vehicle usage. We use commercial-grade films specifically designed for fleet durability.', page: 'fleet', order: 3 },
        { question: 'Can you match our brand guidelines exactly?', answer: 'Absolutely. We use Pantone color matching and can reproduce your exact brand colors, logos, and design elements. We provide proofs for approval before any installation begins.', page: 'fleet', order: 4 },
        { question: 'Do you handle fleet removal and rewrap?', answer: 'Yes. We provide full lifecycle services — from initial design and installation to removal and rewrap when it\'s time to refresh your fleet\'s branding.', page: 'fleet', order: 5 },

        // Ceramic
        { question: 'What is ceramic coating?', answer: 'Ceramic coating is a liquid polymer that chemically bonds with your vehicle\'s paint to create a durable, hydrophobic layer. It provides superior UV protection, chemical resistance, and an incredible gloss finish.', page: 'ceramic', order: 1 },
        { question: 'How long does ceramic coating last?', answer: 'Professional-grade ceramic coatings last 2–5+ years depending on the product and maintenance. Our premium packages include multi-year coatings that provide long-term protection.', page: 'ceramic', order: 2 },
        { question: 'Can you apply ceramic coating over PPF or vinyl wrap?', answer: 'Yes! Ceramic coating can be applied over PPF and vinyl wraps. It adds an extra layer of hydrophobic protection and makes wrapped surfaces easier to clean and maintain.', page: 'ceramic', order: 3 },
        { question: 'What\'s the difference between DIY and professional ceramic coating?', answer: 'Professional coatings use higher-concentration formulas that require proper surface preparation, controlled environments, and trained application. The result is significantly more durable than consumer-grade products.', page: 'ceramic', order: 4 },

        // Aftermarket
        { question: 'What aftermarket modifications do you offer?', answer: 'We offer a range of aftermarket services including spoilers, splitters, diffusers, widebody kits, carbon fiber components, window tinting, and chrome/trim modifications.', page: 'aftermarket', order: 1 },
        { question: 'Can you install parts I purchase myself?', answer: 'Yes, we accept customer-supplied parts. However, we recommend consulting with us before purchasing to ensure fitment and compatibility with your vehicle.', page: 'aftermarket', order: 2 },
        { question: 'Do you offer paint-matched aftermarket parts?', answer: 'Yes. We can color-match aftermarket parts to your vehicle\'s paint code or wrap them in vinyl to seamlessly blend with your existing finish.', page: 'aftermarket', order: 3 },
        { question: 'Do you combine wrap and aftermarket services?', answer: 'Absolutely! Many of our clients combine a vinyl wrap with aftermarket modifications for a complete vehicle transformation. We offer package pricing for combined services.', page: 'aftermarket', order: 4 },

        // General
        { question: 'Where is EMWRAPS located?', answer: 'We\'re located at 1900 Airport Way S #103, Seattle, WA 98134. We\'re conveniently located near Georgetown and SoDo, just minutes from downtown Seattle.', page: 'general', order: 1 },
        { question: 'Do you offer financing?', answer: 'Yes, we offer flexible financing options for larger projects. Contact us or visit our booking page for more details on payment plans.', page: 'general', order: 2 },
        { question: 'Do you offer a warranty on your work?', answer: 'Yes. All our installations come with a workmanship warranty. Additionally, the film manufacturers (3M, XPEL, Avery Dennison, etc.) provide their own material warranties.', page: 'general', order: 3 },
    ];

    for (const faq of faqs) {
        const result = await api('faqs', faq);
        if (result) console.log(`  ✅ FAQ (${faq.page}): ${faq.question.substring(0, 50)}...`);
    }
}

// ── Seed Services ──
async function seedServices() {
    console.log('\n🔧 Seeding Services...');
    const services = [
        {
            name: 'Vinyl Wraps',
            slug: 'vinyl',
            tagline: 'Transform Your Vision Into Reality',
            shortDescription: 'Full color change wraps, custom designs, race liveries, and partial wraps using premium 3M and Avery Dennison films.',
            active: true,
            order: 1,
            accentColor: '#e8a845',
            pricingTiers: [
                { name: 'Partial Wrap', description: 'Roof, hood, mirrors, accents, chrome delete', startingPrice: 800, priceNote: 'Starting at', popular: false },
                { name: 'Full Body Wrap', description: 'Complete color change with premium cast vinyl film', startingPrice: 2500, priceNote: 'Starting at', popular: true },
                { name: 'Custom Design', description: 'One-of-a-kind graphics, prints, race liveries', startingPrice: 4000, priceNote: 'Starting at', popular: false },
            ],
            processSteps: [
                { step: 1, title: 'Consultation', description: 'Discuss your vision, review color options, and get a detailed quote' },
                { step: 2, title: 'Design', description: 'Custom designs rendered digitally for your approval before installation' },
                { step: 3, title: 'Preparation', description: 'Thorough wash, clay bar, and surface decontamination' },
                { step: 4, title: 'Installation', description: 'Precision wrapping by our certified installers in a controlled environment' },
                { step: 5, title: 'Quality Check', description: 'Final inspection, edge sealing, and post-installation care guide' },
            ],
            benefits: [
                { title: 'Reversible', description: 'Remove anytime to reveal original paint underneath' },
                { title: '100+ Colors', description: 'Matte, satin, gloss, metallic, color-shift, and more' },
                { title: 'Paint Protection', description: 'Acts as a barrier against minor chips and UV damage' },
                { title: '5-7 Year Durability', description: 'Premium cast films that last with proper care' },
            ],
        },
        {
            name: 'Paint Protection Film',
            slug: 'ppf',
            tagline: 'Invisible Armor for Your Paint',
            shortDescription: 'Self-healing PPF installation from XPEL and 3M. Full body, full front, and partial coverage options.',
            active: true,
            order: 2,
            accentColor: '#45c8e8',
            pricingTiers: [
                { name: 'Partial Coverage', description: 'High-impact areas: mirrors, door edges, door cups', startingPrice: 500, priceNote: 'Starting at', popular: false },
                { name: 'Full Front', description: 'Hood, fenders, front bumper, headlights', startingPrice: 1500, priceNote: 'Starting at', popular: true },
                { name: 'Full Body', description: 'Complete vehicle coverage for maximum protection', startingPrice: 5000, priceNote: 'Starting at', popular: false },
            ],
        },
        {
            name: 'Itasha',
            slug: 'itasha',
            tagline: 'Waifu on Wheels',
            shortDescription: 'Professional anime-inspired vehicle wraps. Custom character art, full body itasha builds, and convention-ready show cars.',
            active: true,
            order: 3,
            accentColor: '#ff6b9d',
        },
        {
            name: 'Fleet Wraps',
            slug: 'fleet',
            tagline: 'Your Brand, Mobile',
            shortDescription: 'Commercial vehicle wraps for fleets of any size. Brand-matched colors, logo placement, and volume pricing.',
            active: true,
            order: 4,
            accentColor: '#6bc8ff',
        },
        {
            name: 'Ceramic Coating',
            slug: 'ceramic',
            tagline: 'The Ultimate Paint Protection',
            shortDescription: 'Professional ceramic coating for lasting hydrophobic protection, UV resistance, and show-car gloss on paint, PPF, or vinyl.',
            active: true,
            order: 5,
            accentColor: '#88e8a8',
        },
        {
            name: 'Aftermarket',
            slug: 'aftermarket',
            tagline: 'Complete the Build',
            shortDescription: 'Spoilers, splitters, widebody kits, carbon fiber components, window tinting, and custom modifications.',
            active: true,
            order: 6,
            accentColor: '#c888e8',
        },
    ];

    for (const svc of services) {
        const result = await api('services', svc);
        if (result) console.log(`  ✅ Service: ${svc.name}`);
    }
}

// ── Seed Site Settings (Global) ──
async function seedSiteSettings() {
    console.log('\n⚙️ Seeding Site Settings...');
    const settings = {
        businessName: 'EMWRAPS',
        tagline: "Seattle's Premier Vehicle Wrap Shop",
        description: 'Professional vinyl wraps, PPF, ceramic coatings, itasha, fleet wraps, and aftermarket modifications in Seattle, WA. Certified installers using 3M, XPEL, and Avery Dennison.',
        contact: {
            address: '1900 Airport Way S #103, Seattle, WA 98134',
            phone: '(206) 383-5328',
            email: 'emwraps.net@gmail.com',
        },
        hours: [
            { day: 'Monday', open: '9:00 AM', close: '6:00 PM', closed: false },
            { day: 'Tuesday', open: '9:00 AM', close: '6:00 PM', closed: false },
            { day: 'Wednesday', open: '9:00 AM', close: '6:00 PM', closed: false },
            { day: 'Thursday', open: '9:00 AM', close: '6:00 PM', closed: false },
            { day: 'Friday', open: '9:00 AM', close: '6:00 PM', closed: false },
            { day: 'Saturday', open: '10:00 AM', close: '4:00 PM', closed: false },
            { day: 'Sunday', open: '', close: '', closed: true },
        ],
        social: {
            instagram: 'https://instagram.com/emwraps',
            tiktok: 'https://tiktok.com/@emwraps',
            facebook: 'https://facebook.com/emwraps',
            youtube: 'https://youtube.com/@emwraps',
        },
        reviews: {
            googleRating: 4.8,
            totalReviews: 37,
        },
    };

    const result = await apiUpdate('globals/site-settings', settings);
    if (result) console.log('  ✅ Site Settings updated');
}

// ── Seed Homepage (Global) ──
async function seedHomepage() {
    console.log('\n🏠 Seeding Homepage...');
    const homepage = {
        hero: {
            headline: 'EMWRAPS',
            subheadline: "Seattle's Premier Vehicle Customization Studio",
            ctaText: 'Book a Consultation',
            ctaLink: '/booking',
            secondaryCtaText: 'View Our Work',
            secondaryCtaLink: '#showcase',
        },
        stats: [
            { value: '500+', label: 'Vehicles Wrapped' },
            { value: '4.8★', label: 'Google Rating' },
            { value: '5+', label: 'Years Experience' },
            { value: '100%', label: 'Satisfaction' },
        ],
        featuredServices: {
            title: 'Our Services',
            subtitle: 'Premium Vehicle Customization Services in Seattle',
        },
        showcase: {
            title: 'Recent Work',
            subtitle: 'Browse our latest projects',
            maxItems: 6,
        },
        testimonialsSection: {
            title: 'What Our Clients Say',
            subtitle: 'Real reviews from real customers',
            maxItems: 4,
        },
        ctaBanner: {
            title: 'Ready to Transform Your Vehicle?',
            description: 'Get a free consultation and quote today',
            ctaText: 'Get Your Free Quote',
            ctaLink: '/booking',
        },
    };

    const result = await apiUpdate('globals/homepage', homepage);
    if (result) console.log('  ✅ Homepage updated');
}

// ── Seed Testimonials ──
async function seedTestimonials() {
    console.log('\n⭐ Seeding Testimonials...');
    const testimonials = [
        {
            name: 'Marcus T.',
            role: 'BMW M4 Owner',
            content: 'EMWRAPS did an incredible job on my M4. The satin black wrap is flawless — every edge is perfect. These guys are true craftsmen. Will be back for PPF on my next car.',
            rating: 5,
            service: 'vinyl',
            featured: true,
            vehicle: '2024 BMW M4 Competition',
        },
        {
            name: 'Sarah K.',
            role: 'Fleet Manager, Pacific NW Delivery Co.',
            content: 'We wrapped our entire fleet of 12 vans with EMWRAPS. The branding is consistent across all vehicles and the turnaround time was impressive. Great pricing for volume too.',
            rating: 5,
            service: 'fleet',
            featured: true,
            vehicle: 'Mercedes-Benz Sprinter Fleet',
        },
        {
            name: 'Alex H.',
            role: 'Porsche 911 GT3 Owner',
            content: 'Had full body XPEL PPF installed on my GT3. The film is invisible and has already saved my paint from a few rock chips on the track. Worth every penny.',
            rating: 5,
            service: 'ppf',
            featured: true,
            vehicle: '2023 Porsche 911 GT3',
        },
        {
            name: 'Yuki M.',
            role: 'Anime Enthusiast',
            content: 'My itasha Civic is a work of art! The design team nailed the character art perfectly. I get compliments at every car meet and anime convention. Thank you EMWRAPS!',
            rating: 5,
            service: 'itasha',
            featured: true,
            vehicle: '2022 Honda Civic Si',
        },
        {
            name: 'James R.',
            role: 'Tesla Model 3 Owner',
            content: 'Got ceramic coating on my Model 3 right after delivery. The hydrophobic effect is amazing — water just sheets off. Paint still looks showroom-new after 6 months.',
            rating: 5,
            service: 'ceramic',
            featured: false,
            vehicle: '2024 Tesla Model 3',
        },
        {
            name: 'Mike D.',
            role: 'Ferrari 488 Owner',
            content: 'Trusted EMWRAPS with my 488 for a full front PPF and ceramic coating package. The attention to detail is unmatched in Seattle. These guys treat your car like it\'s their own.',
            rating: 5,
            service: 'ppf',
            featured: true,
            vehicle: '2021 Ferrari 488 Pista',
        },
    ];

    for (const t of testimonials) {
        const result = await api('testimonials', t);
        if (result) console.log(`  ✅ Testimonial: ${t.name}`);
    }
}

// ── Main ──
async function main() {
    console.log('🌱 EMWRAPS CMS Seed Script');
    console.log('========================\n');

    await login();
    await seedCategories();
    await seedFAQs();
    await seedServices();
    await seedTestimonials();
    await seedSiteSettings();
    await seedHomepage();

    console.log('\n✅ Seeding complete!');
    console.log('Go to http://localhost:3001/admin to see the data.');
}

main().catch(console.error);
