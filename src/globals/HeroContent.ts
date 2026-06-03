import type { GlobalConfig } from 'payload'

export const HeroContent: GlobalConfig = {
  slug: 'hero-content',
  label: 'Home — Hero Section',
  admin: {
    group: 'Page Content',
    description: 'Controls the main hero banner on the Home page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Headline',
      defaultValue: 'Evolving Human Resources',
      admin: {
        description: 'Main large heading. Keep it powerful and short.',
      },
    },
    {
      name: 'subtext',
      type: 'textarea',
      label: 'Supporting Text',
      defaultValue:
        'Empowering organisations to grow through people. Innovative HR solutions, tailored strategies, and real impact — all in one place.',
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      label: 'Primary CTA Label',
      defaultValue: "Let's Connect",
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      label: 'Secondary CTA Label',
      defaultValue: 'View My Services',
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: 'Portrait Photo',
      admin: {
        description: 'Professional headshot. Shown in the hero section.',
      },
    },
    {
      name: 'identityTitle',
      type: 'text',
      label: 'Identity Title (under name)',
      defaultValue: 'HR Business Partner and Talent Strategist',
    },
    {
      name: 'aboutLinkLabel',
      type: 'text',
      label: '"Read More" Link Label',
      defaultValue: 'Read More About Me →',
    },
  ],
}
