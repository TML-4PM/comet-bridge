import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../../lib/supabase'
import { validateApiKey } from '../../../../lib/auth'

const VALID_SIGNAL_FAMILIES = [
  'tabs_content', 'finance_maat', 'open_banking', 'rdti_ip_research',
  'work_delivery', 'calendar_time', 'people_orgs', 'products_pricing', 'systems_config'
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const {
    org_id,
    signal_family,
    channel,
    source_system,
    // Optional
    business_id,
    topic,
    topics,
    summary,
    actions,
    tags,
    importance_score,
    time_window_start,
    time_window_end,
    primary_url,
    raw_meta,
  } = req.body

  // Required field validation
  if (!org_id) return res.status(400).json({ error: 'org_id is required' })
  if (!signal_family) return res.status(400).json({ error: 'signal_family is required' })
  if (!channel) return res.status(400).json({ error: 'channel is required' })
  if (!source_system) return res.status(400).json({ error: 'source_system is required' })

  if (!VALID_SIGNAL_FAMILIES.includes(signal_family)) {
    return res.status(400).json({
      error: `Invalid signal_family. Must be one of: ${VALID_SIGNAL_FAMILIES.join(', ')}`
    })
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('t4h_insights')
    .insert({
      org_id,
      business_id: business_id || null,
      signal_family,
      channel,
      source_system,
      topic: topic || null,
      topics: topics || [],
      summary: summary || null,
      actions: actions || [],
      tags: tags || [],
      importance_score: importance_score ?? 0,
      state: 'active',
      time_window_start: time_window_start || now,
      time_window_end: time_window_end || null,
      primary_url: primary_url || null,
      link_count: 0,
      raw_meta: raw_meta || {},
    })
    .select('insight_id, org_id, business_id, signal_family, channel, topic, summary, actions, tags, primary_url, created_at')
    .single()

  if (error) {
    console.error('Ingest error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({
    insight_id: data.insight_id,
    org_id: data.org_id,
    business_id: data.business_id,
    signal_family: data.signal_family,
    channel: data.channel,
    topic: data.topic,
    summary: data.summary,
    actions: data.actions,
    tags: data.tags,
    primary_url: data.primary_url,
    created_at: data.created_at,
  })
}
