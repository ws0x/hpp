/**
 * Payload admin provider layout.
 *
 * Uses Payload's official RootLayout which sets up the complete provider tree
 * (ServerFunctionsProvider, ConfigProvider, AuthProvider, TranslationProvider,
 * and all other Payload admin providers). Without this layout, admin pages throw
 * "useServerFunctions must be used within a ServerFunctionsProvider" and similar
 * context errors because the provider tree is never mounted.
 *
 * NOTE: RootLayout renders its own <html><body>. This technically produces nested
 * HTML structure when combined with the root layout, but browsers handle it
 * gracefully and the admin panel works correctly. This is the standard approach
 * for Payload integrated into an existing Next.js app.
 */

import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

// Payload's complete admin stylesheet. Without this import the entire admin
// panel renders as unstyled HTML (nav items run together, forms/login lose all
// layout). This MUST stay — it is the foundation of the admin UI.
import '@payloadcms/next/css'
// H++ brand overrides layered on top of Payload's base styles.
import '@/styles/admin.css'

import config from '@payload-config'
import { importMap } from './admin/importMap.js'

async function serverFunction(args: unknown) {
  'use server'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handleServerFunctions({ ...(args as any), config, importMap })
}

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return RootLayout({ children, config, importMap, serverFunction })
}
