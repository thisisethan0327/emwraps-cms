import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
    slug: 'faqs',
    admin: {
        useAsTitle: 'question',
        defaultColumns: ['question', 'page', 'order'],
        group: 'Content',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'question',
            type: 'text',
            required: true,
        },
        {
            name: 'answer',
            type: 'textarea',
            required: true,
        },
        {
            name: 'page',
            type: 'select',
            required: true,
            options: [
                { label: 'Vinyl Wraps', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet Wraps', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
                { label: 'General', value: 'general' },
            ],
            admin: {
                description: 'Which service page this FAQ belongs to',
            },
        },
        {
            name: 'order',
            type: 'number',
            required: true,
            defaultValue: 0,
            admin: {
                description: 'Display order within the page (lower = shown first)',
            },
        },
    ],
}
