'use client'
import React from 'react'

/**
 * Icon component — used as the small nav icon in the Payload admin sidebar.
 * Renders the EMWRAPS icon from Supabase S3 storage.
 */
const Icon: React.FC = () => {
    return (
        <img
            src="https://sbbxsqvoxrzcgtslspbo.supabase.co/storage/v1/object/public/emw-logo/icon.png"
            alt="EMWRAPS"
            style={{
                width: '26px',
                height: '26px',
                objectFit: 'contain',
            }}
        />
    )
}

export default Icon
