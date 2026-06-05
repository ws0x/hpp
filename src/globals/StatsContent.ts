import type { GlobalConfig } from 'payload'

export const StatsContent: GlobalConfig = {
  slug: 'stats-content',
  label: 'Home — Stats Bar',
  admin: {
    group: 'Page Content',
    description: 'Social proof numbers shown on the Home page.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'isVisible',
      type: 'checkbox',
      label: 'Show stats bar on Home page',
      defaultValue: true,
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Each stat appears as a number + label pair.',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value (e.g. "150+")',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label (e.g. "Candidates Placed")',
        },
      ],
      defaultValue: [
        { value: '10+',  label: 'Years of Experience' },
        { value: '50+',  label: 'Organizations Served' },
        { value: 'MENA', label: 'Regional Coverage' },
        { value: '30K+', label: 'Professional Network' },
      ],
    },
  ],
}
