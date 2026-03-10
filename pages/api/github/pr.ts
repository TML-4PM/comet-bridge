import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

// Map repo full_name → { org_id, business_id }
// Update this with your actual org_id and business mappings
const REPO_MAP: Record<string, { org_id: string; business_id: string | null }> = {
  // 'TML-4PM/mcp-command-centre': { org_id: 'f0e12a4d-fc16-4f11-a0d5-a76bc88df8a1', business_id: null },
  // Add more repos as needed
  '_default': { org_id: 'f0e12a4d-fc16-4f11-a0d5-a76bc88df8a1', business_id: null },
}

function verifyGithubSignature(req: NextApiRequest, secret: string): boolean {
  const sig256 = req.headers['x-hub-signature-256'] as string
  if (!sig256) return false
  const body = JSON.stringify(req.body)
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(sig256), Buffer.from(expected))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const githubSecret = process.env.GITHUB_WEBHOOK_SECRET
  if (githubSecret && !verifyGithubSignature(req, githubSecret)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const event = req.headers['x-github-event']
  if (event !== 'pull_request') {
    return res.status(200).json({ skipped: true, event })
  }

  const { action, pull_request: pr, repository: repo } = req.body
  if (!pr || !repo) {
    return res.status(200).json({ skipped: true, reason: 'missing pr or repo' })
  }

  const mapping = REPO_MAP[repo.full_name] || REPO_MAP['_default']

  const payload = {
    org_id: mapping.org_id,
    business_id: mapping.business_id,
    signal_family: 'work_delivery',
    channel: 'pr',
    source_system: 'github',
    topic: `[PR #${pr.number}] ${pr.title}`,
    topics: [],
    summary: pr.body ? pr.body.slice(0, 500) : '',
    actions: [],
    tags: ['pr', action],
    importance_score: 0,
    time_window_start: pr.created_at,
    time_window_end: pr.closed_at || null,
    primary_url: pr.html_url,
    raw_meta: {
      github_pr_number: pr.number,
      github_repo: repo.full_name,
      github_author: pr.user.login,
      github_labels: (pr.labels || []).map((l: { name: string }) => l.name),
      github_state: pr.state,
      github_action: action,
    },
  }

  // Internal call to ingest/signal
  const apiKey = process.env.BRIDGE_API_KEY
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || `https://${req.headers.host}`
  
  try {
    const ingestRes = await fetch(`${baseUrl}/api/v1/ingest/signal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })
    const ingestData = await ingestRes.json()
    return res.status(200).json({ ingested: true, insight_id: ingestData.insight_id })
  } catch (err) {
    console.error('PR ingest error:', err)
    return res.status(500).json({ error: 'Failed to ingest PR event' })
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } }
}
