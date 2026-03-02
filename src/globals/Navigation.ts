import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
    slug: 'navigation',
    admin: {
        group: 'Settings',
        description: 'Main and footer navigation menus',
    },
    access: {
        read: () => true,
    },
    fields: [
        // ── Main Navigation ──
        {
            name: 'mainNav',
            type: 'array',
            admin: {
                description: 'Main header navigation items',
            },
            fields: [
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'link',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'URL path (e.g., "/vinyl", "/ppf")',
                    },
                },
                {
                    name: 'highlight',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Highlight this item (e.g., CTA button style)',
                    },
                },
                // ── Dropdown children ──
                {
                    name: 'children',
                    type: 'array',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'link',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'description',
                            type: 'text',
                            admin: {
                                description: 'Short description for mega menu',
                            },
                        },
                    ],
                },
            ],
        },
        // ── Footer Navigation ──
        {
            name: 'footerNav',
            type: 'array',
            admin: {
                description: 'Footer navigation columns',
            },
            fields: [
                {
                    name: 'heading',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Column heading (e.g., "Services", "Company", "Legal")',
                    },
                },
                {
                    name: 'links',
                    type: 'array',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'link',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'external',
                            type: 'checkbox',
                            defaultValue: false,
                            admin: {
                                description: 'Opens in new tab',
                            },
                        },
                    ],
                },
            ],
        },
        // ── Footer Text ──
        {
            name: 'footerCopyright',
            type: 'text',
            defaultValue: '© 2026 EMWRAPS. All rights reserved.',
        },
    ],
}
