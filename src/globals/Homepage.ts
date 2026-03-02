import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
    slug: 'homepage',
    admin: {
        group: 'Settings',
        description: 'Homepage hero content, featured sections, and layout configuration',
    },
    access: {
        read: () => true,
    },
    fields: [
        // ── Hero Section ──
        {
            name: 'hero',
            type: 'group',
            fields: [
                {
                    name: 'headline',
                    type: 'text',
                    defaultValue: 'EMWRAPS',
                },
                {
                    name: 'subheadline',
                    type: 'text',
                    defaultValue: 'Seattle\'s Premier Vehicle Customization Studio',
                },
                {
                    name: 'ctaText',
                    type: 'text',
                    defaultValue: 'Book a Consultation',
                },
                {
                    name: 'ctaLink',
                    type: 'text',
                    defaultValue: '/booking',
                },
                {
                    name: 'secondaryCtaText',
                    type: 'text',
                    defaultValue: 'View Our Work',
                },
                {
                    name: 'secondaryCtaLink',
                    type: 'text',
                    defaultValue: '#showcase',
                },
                {
                    name: 'backgroundVideo',
                    type: 'text',
                    admin: {
                        description: 'URL to hero background video (optional)',
                    },
                },
                {
                    name: 'backgroundImage',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
        // ── Stats Section ──
        {
            name: 'stats',
            type: 'array',
            defaultValue: [
                { value: '500+', label: 'Vehicles Wrapped' },
                { value: '4.8★', label: 'Google Rating' },
                { value: '5+', label: 'Years Experience' },
                { value: '100%', label: 'Satisfaction' },
            ],
            fields: [
                {
                    name: 'value',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                },
            ],
        },
        // ── Featured Services ──
        {
            name: 'featuredServices',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: 'Our Services',
                },
                {
                    name: 'subtitle',
                    type: 'text',
                    defaultValue: 'Premium Vehicle Customization Services in Seattle',
                },
            ],
        },
        // ── Showcase Section ──
        {
            name: 'showcase',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: 'Recent Work',
                },
                {
                    name: 'subtitle',
                    type: 'text',
                    defaultValue: 'Browse our latest projects',
                },
                {
                    name: 'maxItems',
                    type: 'number',
                    defaultValue: 6,
                    admin: {
                        description: 'Number of featured projects to display',
                    },
                },
            ],
        },
        // ── Testimonials Section ──
        {
            name: 'testimonialsSection',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: 'What Our Clients Say',
                },
                {
                    name: 'subtitle',
                    type: 'text',
                    defaultValue: 'Real reviews from real customers',
                },
                {
                    name: 'maxItems',
                    type: 'number',
                    defaultValue: 4,
                },
            ],
        },
        // ── CTA Banner ──
        {
            name: 'ctaBanner',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    defaultValue: 'Ready to Transform Your Vehicle?',
                },
                {
                    name: 'description',
                    type: 'text',
                    defaultValue: 'Get a free consultation and quote today',
                },
                {
                    name: 'ctaText',
                    type: 'text',
                    defaultValue: 'Get Your Free Quote',
                },
                {
                    name: 'ctaLink',
                    type: 'text',
                    defaultValue: '/booking',
                },
                {
                    name: 'backgroundImage',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
}
