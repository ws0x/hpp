import type { CollectionConfig } from 'payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    useAsTitle: 'applicantName',
    group: 'Careers',
    defaultColumns: ['applicantName', 'email', 'job', 'status', 'appliedAt'],
    description: 'Applications submitted through the Careers portal.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      label: 'Job Position',
    },
    {
      name: 'applicantName',
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
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn Profile URL',
    },
    {
      name: 'coverLetter',
      type: 'textarea',
      label: 'Cover Letter',
    },
    {
      name: 'cv',
      type: 'upload',
      relationTo: 'media',
      label: 'CV / Resume',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Application Status',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: '🆕 New', value: 'new' },
        { label: '👀 Reviewing', value: 'reviewing' },
        { label: '⭐ Shortlisted', value: 'shortlisted' },
        { label: '❌ Rejected', value: 'rejected' },
        { label: '✅ Hired', value: 'hired' },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
        description: 'Visible to admins only. Not shared with the applicant.',
      },
    },
    {
      name: 'appliedAt',
      type: 'date',
      label: 'Applied At',
      admin: { position: 'sidebar' },
    },
  ],
}
