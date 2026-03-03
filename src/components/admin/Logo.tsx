'use client'
import React from 'react'

/**
 * Logo component — used on the Payload CMS login page.
 * Renders the full EMWRAPS logo from Supabase S3 storage.
 */
const Logo: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
            }}
        >
            <img
                src="https://sbbxsqvoxrzcgtslspbo.supabase.co/storage/v1/object/public/emw-logo/emw_logo_full.png"
                alt="EMWRAPS"
                style={{
                    maxWidth: '280px',
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                }}
            />
        </div>
    )
}

export default Logo
