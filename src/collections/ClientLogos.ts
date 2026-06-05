import type { CollectionConfig } from 'payload'

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'isActive', 'order'],
    description: 'Client / partner logos shown in the "Trusted by" strip and Clients page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Company Name',
      admin: { description: 'Used as the logo alt text and as a text fallback if no image is set.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Image',
      admin: { description: 'Transparent PNG/SVG preferred. Displayed in grayscale, colour on hover.' },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL (optional)',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active (visible on site)',
      defaultValue: true,
    },
  ],
}
