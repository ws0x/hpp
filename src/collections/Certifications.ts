import type { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'issuer', 'year', 'isActive'],
    description: 'Professional certifications and badges shown on the About page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Certification Name',
    },
    {
      name: 'issuer',
      type: 'text',
      required: true,
      label: 'Issuing Organisation',
    },
    {
      name: 'year',
      type: 'number',
      label: 'Year Achieved',
    },
    {
      name: 'badgeImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Badge / Logo Image',
    },
    {
      name: 'verifyUrl',
      type: 'text',
      label: 'Verification URL (optional)',
      admin: {
        description: 'Link to verify this certification online.',
      },
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
