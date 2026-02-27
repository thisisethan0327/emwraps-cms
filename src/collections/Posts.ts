import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'status', 'publishedAt'],
        group: 'Content',
    },
    access: {
        read: () => true, // Public read for the frontend
    },
    versions: {
        drafts: true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'URL-friendly version of the title (e.g., "ferrari-sf90-full-ppf-build")',
            },
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
            name: 'excerpt',
            type: 'textarea',
            maxLength: 300,
            admin: {
                description: 'Short summary shown in blog listing and meta description (max 300 chars)',
            },
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'featuredImage',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: false,
        },
        {
            name: 'tags',
            type: 'array',
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                },
            ],
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            admin: {
                description: 'Who wrote this post',
            },
        },
        {
            name: 'status',
            type: 'select',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
            ],
            defaultValue: 'draft',
            required: true,
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                description: 'When this post should appear as published',
            },
        },
        // ── Related service (links blog to a service page) ──
        {
            name: 'relatedService',
            type: 'select',
            options: [
                { label: 'Vinyl Wraps', value: 'vinyl' },
                { label: 'PPF', value: 'ppf' },
                { label: 'Itasha', value: 'itasha' },
                { label: 'Fleet Wraps', value: 'fleet' },
                { label: 'Ceramic Coating', value: 'ceramic' },
                { label: 'Aftermarket', value: 'aftermarket' },
            ],
            admin: {
                description: 'Link this post to a specific service page for cross-referencing',
            },
        },
        // ── Related project (links blog to a portfolio project) ──
        {
            name: 'relatedProject',
            type: 'relationship',
            relationTo: 'projects',
            hasMany: false,
            admin: {
                description: 'Link to a portfolio project featured in this post',
            },
        },
    ],
}
