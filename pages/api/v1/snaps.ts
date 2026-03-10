import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import { validateApiKey } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { org_id, business_id, limit = '100', before, after } = req.query

  if (!org_id) {
    return res.status(400).json({ error: 'org_id is required' })
  }

  let query = supabase
    .from('t4h_tab_snaps')
    .select('id, created_at, topic, summary, tags, url, importance_score, raw_meta')
    .eq('org_id', org_id as string)
    .order('created_at', { ascending: false })
    .limit(Math.min(parseInt(limit as string, 10), 500))

  if (business_id) {
    query = query.eq('business_id', business_id as string)
  }
  if (after) {
    query = query.gte('created_at', after as string)
  }
  if (before) {
    query = query.lte('created_at', before as string)
  }

  const { data, error } = await query

  if (error) {
    console.error('Snaps list error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ snaps: data || [] })
}
