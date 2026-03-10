# comet-bridge

Bridge API + frontend for Comet (Snaps, PR Memory, Studio).

## Stack
- Next.js 14 (Pages Router)
- Supabase (lzfgigiyqpuuxslsygjt)
- Vercel deploy

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/v1/health | none | Health check |
| POST | /api/v1/ingest/signal | Bearer BRIDGE_API_KEY | Ingest any signal |
| GET | /api/v1/snaps | Bearer BRIDGE_API_KEY | List tab snaps |
| POST | /api/github/pr | GitHub webhook secret | PR Memory webhook |

## Deploy to Vercel

```bash
# 1. Push to GitHub under TML-4PM org
git init && git add . && git commit -m "feat: comet-bridge v0.1"

# 2. Create Vercel project
vercel --yes

# 3. Set env vars
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add BRIDGE_API_KEY production
vercel env add NEXT_PUBLIC_ORG_ID production
vercel env add NEXT_PUBLIC_API_BASE production
vercel env add NEXT_PUBLIC_API_KEY production
```

## Chrome Extension (development)

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked" → select `extension/` folder
4. Click the 🌠 toolbar button
5. First time: enter your Org ID + API Key + API Base URL in options

## Supabase Tables Created
- `t4h_orgs` — org shell + white-label config
- `t4h_org_members` — user→org roles
- `t4h_insights` — unified signal backbone (extended from existing)
- `t4h_products` — SNAPS + PRMEM
- `t4h_product_tiers` — FREE/LOW/EXPECTED/CRAZY tiers
- `t4h_studio_ideas` — Swarm backlog with scoring

## Views
- `t4h_tab_snaps` — filter on signal_family=tabs_content, channel=browser_tab
- `t4h_pr_memory` — filter on signal_family=work_delivery, channel=pr
