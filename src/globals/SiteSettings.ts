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
      defaultValue: 'Building Organizations Ready for Growth',
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
          defaultValue: 'business@hplusplus.com',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '+20 100 123 4567',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location / City',
          defaultValue: 'Cairo, Egypt · Dubai, UAE',
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
          defaultValue: 'https://www.linkedin.com/in/wessam-abd-el-majeed/',
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
          defaultValue: 'H++ | Building Organizations Ready for Growth',
        },
        {
          name: 'defaultMetaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
          defaultValue:
            'H++ is a strategic people consulting firm helping scaling businesses build scalable organizations, stronger leadership teams, and high-performing workforces across the MENA region.',
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
