import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    group: 'Careers',
    defaultColumns: ['title', 'employmentType', 'industry', 'isActive', 'applicationDeadline'],
    description: 'Job listings shown in the Careers portal.',
    preview: (doc) => {
      const slug = doc?.slug as string
      if (slug) return `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${slug}`
      return null
    },
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { isActive: { equals: true } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Auto-generated from title. e.g. "senior-hr-business-partner-dubai"',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return (data.title as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company / Client',
      defaultValue: 'H++ Talent',
      admin: {
        description: 'Visible company name. Use "Confidential" to hide client identity.',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: { description: 'e.g. "Dubai, UAE" or "Remote – MENA"' },
    },
    {
      name: 'employmentType',
      type: 'select',
      label: 'Employment Type',
      required: true,
      defaultValue: 'full-time',
      options: [
        { label: 'Full-Time', value: 'full-time' },
        { label: 'Part-Time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'industry',
      type: 'select',
      label: 'Industry',
      required: true,
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Finance & Banking', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Real Estate', value: 'real-estate' },
        { label: 'Retail & E-Commerce', value: 'retail' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Education', value: 'education' },
        { label: 'Hospitality & Tourism', value: 'hospitality' },
        { label: 'HR & Consulting', value: 'hr-consulting' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'experienceLevel',
      type: 'select',
      label: 'Experience Level',
      required: true,
      options: [
        { label: 'Entry Level (0–2 years)', value: 'entry' },
        { label: 'Mid Level (2–5 years)', value: 'mid' },
        { label: 'Senior Level (5–10 years)', value: 'senior' },
        { label: 'Executive (10+ years)', value: 'executive' },
      ],
    },
    {
      name: 'salaryRange',
      type: 'text',
      label: 'Salary Range (optional)',
      admin: {
        description: 'e.g. "AED 15,000–20,000/month" — leave blank if not disclosed.',
      },
    },
    {
      name: 'applicationDeadline',
      type: 'date',
      label: 'Application Deadline',
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Job Description',
      required: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'requirements',
      type: 'richText',
      label: 'Requirements',
      editor: lexicalEditor({}),
    },
    {
      name: 'benefits',
      type: 'richText',
      label: 'Benefits (optional)',
      editor: lexicalEditor({}),
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active (visible on site)',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { description: 'Override default SEO for this job listing.' },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: { description: 'Defaults to job title + company if empty.' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: { description: 'Max 160 characters.' },
        },
      ],
    },
  ],
}
