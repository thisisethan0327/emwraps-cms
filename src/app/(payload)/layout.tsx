/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap'
import './custom.scss'

type Args = {
    children: React.ReactNode
}

export default async function Layout({ children }: Args) {
    return (
        <RootLayout
            config={config}
            importMap={importMap}
            serverFunction={handleServerFunctions}
        >
            {children}
        </RootLayout>
    )
}

export const metadata: Metadata = {
    title: 'EMWRAPS CMS',
    description: 'Content management system for EMWRAPS.net',
}
