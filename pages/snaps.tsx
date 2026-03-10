import type { GetServerSideProps } from 'next'

interface Snap {
  id: string
  created_at: string
  topic: string | null
  summary: string | null
  tags: string[]
  url: string | null
  importance_score: number
  raw_meta: Record<string, unknown>
}

interface Props {
  snaps: Snap[]
  error: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const orgId = process.env.NEXT_PUBLIC_ORG_ID || ''
  const apiKey = process.env.BRIDGE_API_KEY || ''
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'

  try {
    const res = await fetch(`${apiBase}/api/v1/snaps?org_id=${orgId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { props: { snaps: data.snaps || [], error: null } }
  } catch (e) {
    return { props: { snaps: [], error: e instanceof Error ? e.message : 'Failed to load' } }
  }
}

export default function SnapsPage({ snaps, error }: Props) {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>🌠</span>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Snaps</h1>
          <p style={{ color: '#718096', marginTop: 2, fontSize: 14 }}>
            Tab Memory by Comet — {snaps.length} snap{snaps.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ color: '#e53e3e', background: '#fff5f5', padding: 14, borderRadius: 8, marginBottom: 24 }}>
          ⚠ {error}
        </div>
      )}

      {!error && snaps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0aec0', border: '2px dashed #e2e8f0', borderRadius: 12 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌠</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No snaps yet</div>
          <div style={{ fontSize: 14 }}>Install the Chrome extension and click the toolbar button to save your first tab.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {snaps.map((snap) => (
          <div key={snap.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {snap.topic || snap.url || '(untitled)'}
                </div>
                {snap.summary && (
                  <div style={{ color: '#4a5568', fontSize: 13, marginBottom: 8, lineHeight: 1.5 }}>{snap.summary}</div>
                )}
                {snap.tags && snap.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {snap.tags.map((tag) => (
                      <span key={tag} style={{ background: '#eef2ff', color: '#4338ca', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {snap.url && (
                  <a href={snap.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 600, padding: '4px 10px', border: '1px solid #c7d2fe', borderRadius: 6, marginBottom: 6 }}>Open ↗</a>
                )}
                <div style={{ color: '#a0aec0', fontSize: 11 }}>
                  {new Date(snap.created_at).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                {snap.importance_score > 0 && (
                  <div style={{ color: '#f6ad55', fontSize: 11, marginTop: 2 }}>{'★'.repeat(Math.min(snap.importance_score, 5))}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
