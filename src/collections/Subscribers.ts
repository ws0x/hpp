import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    defaultColumns: ['email', 'name', 'status', 'createdAt'],
    description: 'Newsletter subscribers.',
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name (optional)',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Signup Source',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
