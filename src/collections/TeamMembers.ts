import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
    slug: 'team-members',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'role', 'active', 'order'],
        group: 'Business',
        description: 'EMWRAPS team members — show on About/Contact pages',
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
            required: true,
            admin: {
                description: 'Job title (e.g., "Lead Installer", "Owner", "Design Specialist")',
            },
        },
        {
            name: 'bio',
            type: 'textarea',
            admin: {
                description: 'Short bio (2-3 sentences)',
            },
        },
        {
            name: 'photo',
            type: 'upload',
            relationTo: 'media',
        },
        // ── Specialties ──
        {
            name: 'specialties',
            type: 'select',
            hasMany: true,
            options: [
                { label: 'Vinyl Wraps', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet Wraps', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
                { label: 'Design', value: 'design' },
                { label: 'Customer Service', value: 'customer-service' },
            ],
        },
        // ── Certifications ──
        {
            name: 'certifications',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'e.g., "3M Certified Installer", "XPEL Certified"',
                    },
                },
                {
                    name: 'year',
                    type: 'number',
                },
            ],
        },
        // ── Social Links ──
        {
            name: 'social',
            type: 'group',
            fields: [
                { name: 'instagram', type: 'text' },
                { name: 'linkedin', type: 'text' },
            ],
        },
        // ── Experience ──
        {
            name: 'yearsExperience',
            type: 'number',
            admin: {
                description: 'Years of experience in the industry',
            },
        },
        // ── Display ──
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 0,
            admin: {
                description: 'Display order (lower = first)',
            },
        },
    ],
}
