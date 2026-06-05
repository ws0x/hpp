import type { CollectionConfig } from 'payload'

export const UseCases: CollectionConfig = {
  slug: 'use-cases',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'industry', 'isActive', 'order'],
    description: 'Anonymised client scenarios shown in the Use Cases section and page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: { description: 'e.g. "Scaling a fintech from 40 to 200 people".' },
    },
    {
      name: 'industry',
      type: 'text',
      label: 'Industry / Sector',
      admin: { description: 'e.g. "Technology", "Retail & FMCG".' },
    },
    {
      name: 'challenge',
      type: 'textarea',
      required: true,
      label: 'The Challenge',
      admin: { description: 'The people/organization problem the client faced.' },
    },
    {
      name: 'solution',
      type: 'textarea',
      label: 'Our Approach',
      admin: { description: 'How H++ addressed it (optional, shown on the detail page).' },
    },
    {
      name: 'result',
      type: 'textarea',
      required: true,
      label: 'The Result',
      admin: { description: 'The measurable outcome. Lead with a number where possible.' },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      defaultValue: 'structure',
      options: [
        { label: 'Scaling / Growth', value: 'scaling' },
        { label: 'Leadership / People', value: 'leadership' },
        { label: 'Structure / Org', value: 'structure' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active (visible on site)',
      defaultValue: true,
    },
  ],
}
