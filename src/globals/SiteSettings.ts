import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Global site configuration — logo, contact details, social links.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Site Name',
      defaultValue: 'H++',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      defaultValue: 'Evolving Human Resources',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (optional — text logo used if empty)',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      label: 'Contact Information',
      type: 'collapsible',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email',
          defaultValue: 'hello@hplusplus.net',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location / City',
          defaultValue: 'MENA Region',
        },
      ],
    },
    {
      label: 'Social Links',
      type: 'collapsible',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn Profile URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X Profile URL',
        },
        {
          name: 'bookingUrl',
          type: 'text',
          label: 'Booking URL (Cal.com / Calendly)',
          admin: {
            description: 'Used for "Book a Call" buttons across the site.',
          },
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp Number',
          admin: {
            description: 'Include country code, digits only. E.g. 971501234567 for UAE. Leave empty to hide the widget.',
          },
        },
      ],
    },
    {
      label: 'SEO Defaults',
      type: 'collapsible',
      fields: [
        {
          name: 'defaultMetaTitle',
          type: 'text',
          label: 'Default Meta Title',
          defaultValue: 'H++ | Evolving Human Resources',
        },
        {
          name: 'defaultMetaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
          defaultValue:
            'Wessam Abdelmajeed — HR Business Partner & Talent Strategist. Innovative HR consulting, recruitment, and advisory solutions across the MENA region.',
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default Social Share Image',
        },
      ],
    },
  ],
}
