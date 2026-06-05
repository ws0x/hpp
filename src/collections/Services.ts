import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'icon', 'isActive', 'order'],
    description: 'Manage the service cards shown on the Services and Home pages.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Service Title',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      required: true,
      admin: {
        description: 'Shown on the Home page card (1–2 sentences).',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Full Description',
      admin: {
        description: 'Full detail shown on the Services page.',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      required: true,
      options: [
        // Core solutions — the `value` is also the slug used for /services#<value> anchors.
        { label: 'Growth Readiness Diagnostic', value: 'growth-readiness' },
        { label: 'Fractional CHRO', value: 'fractional-chro' },
        { label: 'Organizational Design', value: 'org-design' },
        { label: 'Leadership Advisory', value: 'leadership-advisory' },
        { label: 'Executive Search', value: 'executive-search' },
        // Legacy / general
        { label: 'HR Consulting', value: 'hr-consulting' },
        { label: 'Recruitment', value: 'recruitment' },
        { label: 'Organizational Development', value: 'org-development' },
        { label: 'Training', value: 'training' },
        { label: 'Strategy', value: 'strategy' },
        { label: 'People', value: 'people' },
      ],
      defaultValue: 'growth-readiness',
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Key Highlights',
      admin: {
        description: 'Bullet points of key deliverables for this service.',
      },
      fields: [
        {
          name: 'point',
          type: 'text',
          required: true,
          label: 'Highlight',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active (visible on site)',
      defaultValue: true,
    },
  ],
}
