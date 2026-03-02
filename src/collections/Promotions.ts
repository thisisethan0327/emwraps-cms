import type { CollectionConfig } from 'payload'

export const Promotions: CollectionConfig = {
    slug: 'promotions',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'type', 'startDate', 'endDate', 'active'],
        group: 'Business',
        description: 'Seasonal deals, discount codes, and promotional banners',
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
                description: 'Promotion title (e.g., "Spring Wrap Special")',
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
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Banner', value: 'banner' },
                { label: 'Discount Code', value: 'discount' },
                { label: 'Package Deal', value: 'package' },
                { label: 'Seasonal', value: 'seasonal' },
                { label: 'Referral', value: 'referral' },
            ],
        },
        {
            name: 'description',
            type: 'richText',
        },
        {
            name: 'shortDescription',
            type: 'text',
            maxLength: 150,
            admin: {
                description: 'One-line promo text for banners',
            },
        },
        // ── Discount Details ──
        {
            name: 'discount',
            type: 'group',
            fields: [
                {
                    name: 'type',
                    type: 'select',
                    options: [
                        { label: 'Percentage Off', value: 'percentage' },
                        { label: 'Fixed Amount Off', value: 'fixed' },
                        { label: 'Free Add-On', value: 'addon' },
                    ],
                },
                {
                    name: 'value',
                    type: 'number',
                    admin: {
                        description: 'Discount value (e.g., 15 for 15% or $15 off)',
                    },
                },
                {
                    name: 'code',
                    type: 'text',
                    admin: {
                        description: 'Promo code (if applicable)',
                    },
                },
            ],
        },
        // ── Applicable Services ──
        {
            name: 'applicableServices',
            type: 'select',
            hasMany: true,
            options: [
                { label: 'Vinyl Wraps', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet Wraps', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
                { label: 'All Services', value: 'all' },
            ],
        },
        // ── Media ──
        {
            name: 'bannerImage',
            type: 'upload',
            relationTo: 'media',
        },
        // ── Scheduling ──
        {
            name: 'startDate',
            type: 'date',
            required: true,
            admin: {
                date: { pickerAppearance: 'dayAndTime' },
            },
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            admin: {
                date: { pickerAppearance: 'dayAndTime' },
            },
        },
        // ── CTA ──
        {
            name: 'ctaText',
            type: 'text',
            defaultValue: 'Book Now',
        },
        {
            name: 'ctaLink',
            type: 'text',
            defaultValue: '/booking',
        },
        // ── Display ──
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
        },
        {
            name: 'showOnHomepage',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Feature this promotion on the homepage banner',
            },
        },
        {
            name: 'priority',
            type: 'number',
            defaultValue: 0,
            admin: {
                description: 'Display priority (higher = more prominent)',
            },
        },
    ],
}
