import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
    slug: 'media',
    admin: {
        group: 'Content',
        defaultColumns: ['filename', 'alt', 'category', 'customerName', 'updatedAt'],
    },
    access: {
        read: () => true,
    },
    upload: {
        mimeTypes: ['image/*', 'video/*'],
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 512,
                position: 'centre',
            },
            {
                name: 'hero',
                width: 1920,
                height: 1080,
                position: 'centre',
            },
        ],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
            admin: {
                description: 'Alt text for accessibility and SEO',
            },
        },
        {
            name: 'caption',
            type: 'text',
        },
        // ── Classification Fields ──
        {
            name: 'category',
            type: 'select',
            options: [
                { label: 'Vinyl Wrap', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
                { label: 'Shop / General', value: 'general' },
                { label: 'Before / After', value: 'before-after' },
                { label: 'Detail Shot', value: 'detail' },
            ],
            admin: {
                description: 'Service category for organization and filtering',
            },
        },
        {
            name: 'customerName',
            type: 'text',
            admin: {
                description: 'Customer name (for linking to customer profile)',
            },
        },
        {
            name: 'customerRef',
            type: 'text',
            admin: {
                description: 'Supabase customer UUID (auto-filled when linked)',
            },
        },
        {
            name: 'vehicleInfo',
            type: 'text',
            admin: {
                description: 'Vehicle details (e.g., "2024 Ferrari SF90")',
            },
        },
        {
            name: 'tags',
            type: 'text',
            hasMany: true,
            admin: {
                description: 'Tags for filtering (e.g., "full-body", "matte", "3M")',
            },
        },
    ],
}
