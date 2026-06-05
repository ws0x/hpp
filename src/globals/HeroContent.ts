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
      defaultValue: 'Building Organizations Ready for Growth',
      admin: {
        description: 'Main large heading. Keep it powerful and short.',
      },
    },
    {
      name: 'subtext',
      type: 'textarea',
      label: 'Supporting Text',
      defaultValue:
        'Strategic people consulting that helps scaling businesses unlock potential, build strong leadership, and create high-performing organizations.',
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      label: 'Primary CTA Label',
      defaultValue: 'Get Your Growth Readiness Assessment',
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      label: 'Secondary CTA Label',
      defaultValue: 'Our Solutions',
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
