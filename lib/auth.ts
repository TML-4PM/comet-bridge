import { NextApiRequest } from 'next'

export function validateApiKey(req: NextApiRequest): boolean {
  const apiKey = process.env.BRIDGE_API_KEY
  if (!apiKey) return false
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  return token === apiKey
}
