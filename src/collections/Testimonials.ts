import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
    slug: 'testimonials',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'rating', 'featured', 'updatedAt'],
        group: 'Content',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            type: 'text',
            admin: {
                description: 'e.g., "Ferrari 488 Owner", "Fleet Manager at XYZ Corp"',
            },
        },
        {
            name: 'content',
            type: 'textarea',
            required: true,
        },
        {
            name: 'rating',
            type: 'number',
            required: true,
            min: 1,
            max: 5,
            defaultValue: 5,
        },
        {
            name: 'avatar',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'service',
            type: 'select',
            options: [
                { label: 'Vinyl Wrap', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
                { label: 'General', value: 'general' },
            ],
        },
        {
            name: 'featured',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Show on homepage',
            },
        },
        // ── Customer reference (for future ticket system integration) ──
        {
            name: 'customerRef',
            type: 'text',
            admin: {
                description: 'Supabase customer UUID — links to shared customers table',
                condition: () => false, // Hidden for now
            },
        },
    ],
}
