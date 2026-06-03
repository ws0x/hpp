import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'email', 'company', 'status', 'createdAt'],
    description: 'Contact form submissions from the website.',
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company (optional)',
    },
    {
      name: 'topic',
      type: 'select',
      label: 'Topic',
      options: [
        { label: 'HR Consulting', value: 'hr-consulting' },
        { label: 'Recruitment', value: 'recruitment' },
        { label: 'Training', value: 'training' },
        { label: 'General Inquiry', value: 'general' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Source Page',
      admin: {
        description: 'Which page the form was submitted from.',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Private notes — not visible to the lead.',
      },
    },
  ],
  timestamps: true,
}
