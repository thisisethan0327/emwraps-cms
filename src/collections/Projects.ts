import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
    slug: 'projects',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'featured', 'updatedAt'],
        group: 'Content',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            admin: {
                description: 'e.g., "Ferrari SF90 XX — Full Body PPF"',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (!value && data?.title) {
                            return data.title
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
            name: 'description',
            type: 'textarea',
        },
        // ── Vehicle Details ──
        {
            name: 'vehicle',
            type: 'group',
            fields: [
                { name: 'year', type: 'number' },
                { name: 'make', type: 'text' },
                { name: 'model', type: 'text' },
                { name: 'color', type: 'text' },
            ],
        },
        // ── Service Details ──
        {
            name: 'service',
            type: 'select',
            required: true,
            options: [
                { label: 'Vinyl Wrap', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet Wrap', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
            ],
        },
        {
            name: 'material',
            type: 'text',
            admin: {
                description: 'e.g., "3M 2080", "UNITY USA", "Avery Dennison"',
            },
        },
        {
            name: 'coverage',
            type: 'text',
            admin: {
                description: 'e.g., "Full Body", "Full Front", "Partial"',
            },
        },
        {
            name: 'finish',
            type: 'text',
            admin: {
                description: 'e.g., "Gloss", "Satin", "Matte", "Color PPF"',
            },
        },
        // ── Before/After Comparison ──
        {
            name: 'beforeImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Before photo for comparison slider',
            },
        },
        {
            name: 'afterImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'After photo for comparison slider',
            },
        },
        // ── Gallery Images ──
        {
            name: 'images',
            type: 'array',
            minRows: 1,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'label',
                    type: 'text',
                    admin: {
                        description: 'Optional label (e.g., "Detail", "Interior", "Side View")',
                    },
                },
            ],
        },
        // ── Timeline ──
        {
            name: 'completedAt',
            type: 'date',
            admin: {
                date: { pickerAppearance: 'dayOnly' },
                description: 'When this project was completed',
            },
        },
        {
            name: 'estimatedDuration',
            type: 'text',
            admin: {
                description: 'e.g., "2 days", "1 week", "3-4 hours"',
            },
        },
        // ── Display options ──
        {
            name: 'featured',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Show on homepage showcase',
            },
        },
        {
            name: 'order',
            type: 'number',
            admin: {
                description: 'Display order (lower = shown first)',
            },
        },
        {
            name: 'highlightReel',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Feature in the homepage highlight reel',
            },
        },
        // ── Customer reference (links to ticket system) ──
        {
            name: 'customerRef',
            type: 'text',
            admin: {
                description: 'Supabase customer UUID — links to shared customers table in ticket system',
            },
        },
    ],
}
