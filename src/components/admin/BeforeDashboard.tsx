import { getPayloadClient } from '@/lib/payload'
import Link from 'next/link'

const ADMIN = '/admin'

const BRAND_CSS = `
  /* H++ admin brand overrides */
  .nav {
    background: #1B2B6B !important;
    border-right: 1px solid #142054 !important;
  }
  .nav__scroll, .nav__scroll-content { background: #1B2B6B !important; }
  .nav__header, .nav__brand {
    background: #142054 !important;
    border-bottom: 1px solid #243585 !important;
  }
  .nav a, .nav__link, .nav-group__toggle {
    color: #cbd5e1 !important;
  }
  .nav a:hover, .nav__link:hover {
    color: #fff !important;
    background: rgba(255,255,255,0.08) !important;
    border-radius: 6px;
  }
  .nav-group__label {
    color: #93c5fd !important;
    font-size: 10px !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    font-weight: 700 !important;
  }
  .dashboard__card-link {
    border-radius: 10px !important;
    transition: box-shadow .15s, transform .15s !important;
  }
  .dashboard__card-link:hover {
    box-shadow: 0 8px 20px rgba(27,43,107,0.12) !important;
    transform: translateY(-2px) !important;
  }
  .btn--style-primary {
    background: #F97316 !important;
    border-color: #EA6C09 !important;
  }
  .btn--style-primary:hover { background: #EA6C09 !important; }
`

const statCards = [
  { label: 'New Leads',    collection: 'leads',          color: '#F97316', icon: '📥', href: `${ADMIN}/collections/leads` },
  { label: 'Posts',        collection: 'posts',          color: '#2563EB', icon: '✍️', href: `${ADMIN}/collections/posts` },
  { label: 'Subscribers',  collection: 'subscribers',    color: '#16a34a', icon: '📬', href: `${ADMIN}/collections/subscribers` },
  { label: 'Open Jobs',    collection: 'jobs',           color: '#7c3aed', icon: '💼', href: `${ADMIN}/collections/jobs` },
  { label: 'Services',     collection: 'services',       color: '#0891b2', icon: '⚙️', href: `${ADMIN}/collections/services` },
]

const quickActions = [
  { label: 'New Post',           href: `${ADMIN}/collections/posts/create`,     color: '#2563EB' },
  { label: 'New Job',            href: `${ADMIN}/collections/jobs/create`,       color: '#7c3aed' },
  { label: 'New Service',        href: `${ADMIN}/collections/services/create`,   color: '#0891b2' },
  { label: 'New Testimonial',    href: `${ADMIN}/collections/testimonials/create`, color: '#16a34a' },
  { label: 'Upload Media',       href: `${ADMIN}/collections/media/create`,      color: '#64748b' },
  { label: 'Edit Hero',          href: `${ADMIN}/globals/hero-content`,          color: '#F97316' },
  { label: 'Edit About',         href: `${ADMIN}/globals/about-content`,         color: '#F97316' },
  { label: 'Site Settings',      href: `${ADMIN}/globals/site-settings`,         color: '#1B2B6B' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new:         { bg: '#fef3c7', text: '#92400e', label: 'New' },
    'in-progress': { bg: '#dbeafe', text: '#1e40af', label: 'In Progress' },
    replied:     { bg: '#dcfce7', text: '#166534', label: 'Replied' },
    archived:    { bg: '#f1f5f9', text: '#475569', label: 'Archived' },
  }
  const s = map[status] ?? map['new']
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: s.bg,
      color: s.text,
    }}>
      {s.label}
    </span>
  )
}

export default async function BeforeDashboard() {
  let counts: Record<string, number> = {}
  let recentLeads: Array<{ id: string; name: string; email: string; topic?: string; status: string; createdAt?: string }> = []

  try {
    const payload = await getPayloadClient()

    const results = await Promise.allSettled(
      statCards.map(({ collection }) =>
        payload.count({ collection: collection as Parameters<typeof payload.count>[0]['collection'] })
      )
    )
    statCards.forEach(({ collection }, i) => {
      const r = results[i]
      counts[collection] = r.status === 'fulfilled' ? r.value.totalDocs : 0
    })

    const leadsResult = await payload.find({
      collection: 'leads',
      limit: 6,
      sort: '-createdAt',
      depth: 0,
    })
    recentLeads = leadsResult.docs.map((l) => ({
      id:        l.id as string,
      name:      l.name as string,
      email:     l.email as string,
      topic:     l.topic as string | undefined,
      status:    (l.status as string) ?? 'new',
      createdAt: l.createdAt as string | undefined,
    }))
  } catch {
    // Payload not ready — render gracefully without stats
  }

  return (
    <>
    {/* eslint-disable-next-line react/no-danger */}
    <style dangerouslySetInnerHTML={{ __html: BRAND_CSS }} />
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', marginBottom: 32 }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1B2B6B 0%, #243585 100%)',
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>H++</span>
            <span style={{ fontSize: 13, color: '#93c5fd', fontWeight: 500 }}>Evolving Human Resources</span>
          </div>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: 13 }}>
            Welcome back — manage your content, leads, and careers below.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.12)', color: '#e2e8f0',
              fontSize: 13, fontWeight: 500, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            View Website ↗
          </a>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {statCards.map(({ label, collection, color, icon, href }) => (
          <Link
            key={collection}
            href={href}
            style={{
              display: 'block',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '16px 18px',
              textDecoration: 'none',
              transition: 'box-shadow .15s',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>
              {counts[collection] ?? '—'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              {label}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {quickActions.map(({ label, href, color }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 7,
                background: color + '12',
                color,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                border: `1px solid ${color}30`,
              }}
            >
              + {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Leads ───────────────────────────────── */}
      {recentLeads.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recent Leads
            </h3>
            <Link
              href={`${ADMIN}/collections/leads`}
              style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
            >
              View all →
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            {recentLeads.map((lead, i) => (
              <Link
                key={lead.id}
                href={`${ADMIN}/collections/leads/${lead.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderTop: i > 0 ? '1px solid #f1f5f9' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: '#1B2B6B',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.email}{lead.topic ? ` · ${lead.topic.replace(/-/g, ' ')}` : ''}
                  </div>
                </div>
                <StatusBadge status={lead.status} />
                {lead.createdAt && (
                  <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, marginLeft: 4 }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
