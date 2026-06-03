import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
    description: 'Blog posts shown in the Insights section.',
    preview: (doc) => {
      const slug = doc?.slug as string
      if (slug) return `${process.env.NEXT_PUBLIC_SITE_URL}/insights/${slug}`
      return null
    },
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 3000,
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier, e.g. "future-of-hr-strategy". Auto-generated from title.',
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'Excerpt',
      admin: {
        description: 'Short summary (1–2 sentences) shown in post listings and SEO.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      options: [
        { label: 'HR Strategy', value: 'hr-strategy' },
        { label: 'Recruitment', value: 'recruitment' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Culture & Engagement', value: 'culture' },
        { label: 'MENA HR Insights', value: 'mena' },
        { label: 'Career Tips', value: 'career-tips' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Article Content',
      required: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Reading Time (minutes)',
      admin: {
        position: 'sidebar',
        description: 'Estimated reading time. Auto-calculated if left blank.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Override default SEO values for this post.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: { description: 'Defaults to post title if empty. Max 60 characters.' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: { description: 'Defaults to excerpt if empty. Max 160 characters.' },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
          admin: { description: 'Defaults to cover image. Recommended: 1200×630px.' },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'Hide from search engines',
          defaultValue: false,
        },
      ],
    },
  ],
}
