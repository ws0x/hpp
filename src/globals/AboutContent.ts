import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const AboutContent: GlobalConfig = {
  slug: 'about-content',
  label: 'About Page',
  admin: {
    group: 'Page Content',
    description: 'Bio, mission, and values shown on the About page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      label: 'Page Heading',
      defaultValue: 'About Wessam',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Long-Form Bio',
      required: true,
      editor: lexicalEditor({}),
      admin: {
        description: 'Full professional background and story.',
      },
    },
    {
      name: 'missionStatement',
      type: 'textarea',
      label: 'Mission Statement',
      admin: {
        description: 'Core mission in 1–2 sentences. Shown prominently on the About page.',
      },
    },
    {
      name: 'values',
      type: 'array',
      label: 'Core Values',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Value Name',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    {
      name: 'whyPoints',
      type: 'array',
      label: '"Why H++" Bullet Points',
      admin: {
        description: 'Short differentiator statements shown on Home and About.',
      },
      fields: [
        {
          name: 'point',
          type: 'text',
          required: true,
          label: 'Point',
        },
      ],
      defaultValue: [
        { point: 'Human-first, business-minded' },
        { point: 'Proven track record across MENA' },
        { point: 'Strategic, not transactional' },
        { point: 'Passionate about sustainable HR' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      defaultValue: 'Book a Free Consultation',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
      ],
    },
  ],
}
