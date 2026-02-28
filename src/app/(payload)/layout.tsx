/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import React from 'react'
import { importMap } from './admin/importMap'
import './custom.scss'

type Args = {
    children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async (args) => {
    'use server'
    return handleServerFunctions({
        ...args,
        config,
        importMap,
    })
}

export default async function Layout({ children }: Args) {
    return (
        <RootLayout
            config={config}
            importMap={importMap}
            serverFunction={serverFunction}
        >
            {children}
        </RootLayout>
    )
}

export const metadata: Metadata = {
    title: 'EMWRAPS CMS',
    description: 'Content management system for EMWRAPS.net',
}
