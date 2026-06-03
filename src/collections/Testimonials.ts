import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    group: 'Content',
    defaultColumns: ['clientName', 'company', 'isActive', 'order'],
    description: 'Client testimonials and success stories.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Title / Role',
      admin: { description: 'e.g. "CEO", "Head of People"' },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Testimonial Quote',
      admin: {
        description: 'The full testimonial text (2–4 sentences recommended).',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Client Photo (optional)',
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
