import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    admin: {
        group: 'Settings',
        description: 'EMWRAPS business info, contact details, social links, and hours',
    },
    access: {
        read: () => true,
    },
    fields: [
        // ── Business Info ──
        {
            name: 'businessName',
            type: 'text',
            defaultValue: 'EMWRAPS',
            required: true,
        },
        {
            name: 'tagline',
            type: 'text',
            defaultValue: 'Seattle\'s Premier Vehicle Wrap Shop',
        },
        {
            name: 'description',
            type: 'textarea',
            admin: {
                description: 'Default meta description for SEO',
            },
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'favicon',
            type: 'upload',
            relationTo: 'media',
        },
        // ── Contact Info ──
        {
            name: 'contact',
            type: 'group',
            fields: [
                {
                    name: 'address',
                    type: 'text',
                    defaultValue: '1900 Airport Way S #103, Seattle, WA 98134',
                },
                {
                    name: 'phone',
                    type: 'text',
                    defaultValue: '(206) 383-5328',
                },
                {
                    name: 'email',
                    type: 'text',
                    defaultValue: 'info@emwraps.net',
                },
                {
                    name: 'quoteEmail',
                    type: 'text',
                    defaultValue: 'quote@emwraps.net',
                },
                {
                    name: 'googleMapsUrl',
                    type: 'text',
                    admin: {
                        description: 'Google Maps embed or link URL',
                    },
                },
                {
                    name: 'googlePlaceId',
                    type: 'text',
                    admin: {
                        description: 'Google Place ID for reviews widget',
                    },
                },
            ],
        },
        // ── Business Hours ──
        {
            name: 'hours',
            type: 'array',
            defaultValue: [
                { day: 'Monday', open: '9:00 AM', close: '6:00 PM', closed: false },
                { day: 'Tuesday', open: '9:00 AM', close: '6:00 PM', closed: false },
                { day: 'Wednesday', open: '9:00 AM', close: '6:00 PM', closed: false },
                { day: 'Thursday', open: '9:00 AM', close: '6:00 PM', closed: false },
                { day: 'Friday', open: '9:00 AM', close: '6:00 PM', closed: false },
                { day: 'Saturday', open: '10:00 AM', close: '4:00 PM', closed: false },
                { day: 'Sunday', open: '', close: '', closed: true },
            ],
            fields: [
                {
                    name: 'day',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'open',
                    type: 'text',
                },
                {
                    name: 'close',
                    type: 'text',
                },
                {
                    name: 'closed',
                    type: 'checkbox',
                    defaultValue: false,
                },
            ],
        },
        // ── Social Media ──
        {
            name: 'social',
            type: 'group',
            fields: [
                {
                    name: 'instagram',
                    type: 'text',
                    defaultValue: 'https://instagram.com/emwraps',
                },
                {
                    name: 'tiktok',
                    type: 'text',
                    defaultValue: 'https://tiktok.com/@emwraps',
                },
                {
                    name: 'facebook',
                    type: 'text',
                    defaultValue: 'https://facebook.com/emwraps',
                },
                {
                    name: 'youtube',
                    type: 'text',
                    defaultValue: 'https://youtube.com/@emwraps',
                },
                {
                    name: 'yelp',
                    type: 'text',
                },
                {
                    name: 'google',
                    type: 'text',
                    admin: {
                        description: 'Google Business Profile URL',
                    },
                },
            ],
        },
        // ── Reviews/Ratings ──
        {
            name: 'reviews',
            type: 'group',
            fields: [
                {
                    name: 'googleRating',
                    type: 'number',
                    defaultValue: 4.8,
                    admin: {
                        description: 'Current Google rating (e.g., 4.8)',
                    },
                },
                {
                    name: 'totalReviews',
                    type: 'number',
                    defaultValue: 37,
                    admin: {
                        description: 'Total number of Google reviews',
                    },
                },
            ],
        },
        // ── Announcement Bar ──
        {
            name: 'announcementBar',
            type: 'group',
            fields: [
                {
                    name: 'enabled',
                    type: 'checkbox',
                    defaultValue: false,
                },
                {
                    name: 'message',
                    type: 'text',
                    admin: {
                        description: 'Announcement text (e.g., "🎉 Spring Special: 15% off all wraps!")',
                    },
                },
                {
                    name: 'link',
                    type: 'text',
                },
                {
                    name: 'backgroundColor',
                    type: 'text',
                    defaultValue: '#00ff88',
                },
            ],
        },
    ],
}
