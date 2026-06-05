import type { CollectionConfig } from 'payload'

export const Recommendations: CollectionConfig = {
  slug: 'recommendations',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'company', 'isActive', 'order'],
    description: 'Professional recommendations (e.g. LinkedIn) shown on the Recommendations page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Recommender Name',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Title / Role',
      admin: { description: 'e.g. "Chief Executive Officer".' },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company',
    },
    {
      name: 'relationship',
      type: 'text',
      label: 'Working Relationship',
      admin: { description: 'e.g. "Worked with H++ on org redesign".' },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Recommendation',
      admin: { description: 'The full recommendation text.' },
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn Profile URL (optional)',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo (optional)',
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
