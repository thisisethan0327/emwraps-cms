import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
    slug: 'services',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'active', 'order'],
        group: 'Business',
        description: 'EMWRAPS service offerings — vinyl wraps, PPF, ceramic, etc.',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            admin: {
                description: 'Service name (e.g., "Vinyl Wraps", "Paint Protection Film")',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'URL path (e.g., "vinyl", "ppf", "ceramic")',
            },
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (!value && data?.name) {
                            return data.name
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '')
                        }
                        return value
                    },
                ],
            },
        },
        {
            name: 'tagline',
            type: 'text',
            admin: {
                description: 'Short tagline for hero sections (e.g., "Transform Your Ride")',
            },
        },
        {
            name: 'shortDescription',
            type: 'textarea',
            maxLength: 200,
            admin: {
                description: 'Brief description for cards and previews',
            },
        },
        {
            name: 'fullDescription',
            type: 'richText',
            admin: {
                description: 'Full service description with formatting',
            },
        },
        // ── Hero Section ──
        {
            name: 'hero',
            type: 'group',
            fields: [
                {
                    name: 'heroImage',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: 'Main hero/banner image for the service page',
                    },
                },
                {
                    name: 'heroVideo',
                    type: 'text',
                    admin: {
                        description: 'Optional YouTube/Vimeo embed URL for hero video',
                    },
                },
            ],
        },
        // ── Pricing Tiers ──
        {
            name: 'pricingTiers',
            type: 'array',
            admin: {
                description: 'Pricing options for this service',
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Tier name (e.g., "Full Body", "Full Front", "Partial")',
                    },
                },
                {
                    name: 'description',
                    type: 'textarea',
                    admin: {
                        description: 'What\'s included in this tier',
                    },
                },
                {
                    name: 'startingPrice',
                    type: 'number',
                    admin: {
                        description: 'Starting price in USD (e.g., 2500)',
                    },
                },
                {
                    name: 'priceNote',
                    type: 'text',
                    admin: {
                        description: 'Price qualifier (e.g., "Starting at", "From", "Contact for quote")',
                    },
                },
                {
                    name: 'popular',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Mark as "Most Popular" tier',
                    },
                },
            ],
        },
        // ── Brands/Materials ──
        {
            name: 'brands',
            type: 'array',
            admin: {
                description: 'Brands and materials used for this service',
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Brand name (e.g., "3M", "XPEL", "Avery Dennison")',
                    },
                },
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                },
                {
                    name: 'description',
                    type: 'text',
                },
            ],
        },
        // ── Process Steps ──
        {
            name: 'processSteps',
            type: 'array',
            admin: {
                description: 'Step-by-step process for this service',
            },
            fields: [
                {
                    name: 'step',
                    type: 'number',
                    required: true,
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'icon',
                    type: 'text',
                    admin: {
                        description: 'Icon name or emoji for this step',
                    },
                },
            ],
        },
        // ── Benefits/Features ──
        {
            name: 'benefits',
            type: 'array',
            admin: {
                description: 'Key benefits and features of this service',
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'icon',
                    type: 'text',
                },
            ],
        },
        // ── SEO ──
        {
            name: 'seoTitle',
            type: 'text',
            admin: {
                description: 'Custom SEO title (defaults to service name if empty)',
            },
        },
        {
            name: 'seoDescription',
            type: 'textarea',
            maxLength: 160,
            admin: {
                description: 'Meta description for SEO (max 160 chars)',
            },
        },
        // ── Display Options ──
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                description: 'Show this service on the website',
            },
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 0,
            admin: {
                description: 'Display order in navigation (lower = first)',
            },
        },
        {
            name: 'icon',
            type: 'text',
            admin: {
                description: 'Icon identifier for navigation/cards',
            },
        },
        {
            name: 'accentColor',
            type: 'text',
            admin: {
                description: 'Hex color for service branding (e.g., "#00ff88")',
            },
        },
    ],
}
