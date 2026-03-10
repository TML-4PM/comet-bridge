// Snaps by Comet – background.js (MV3 service worker)
let settings = { orgId: '', apiKey: '', apiBase: '', autoClose: false }

chrome.storage.sync.get(['orgId', 'apiKey', 'apiBase', 'autoClose'], (stored) => {
  settings = { ...settings, ...stored }
})

chrome.storage.onChanged.addListener((changes) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key in settings) settings[key] = newValue
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  if (!settings.orgId || !settings.apiKey || !settings.apiBase) {
    chrome.notifications.create({
      type: 'basic', iconUrl: 'icons/icon128.png',
      title: 'Snaps by Comet',
      message: 'Please configure your settings first.',
    })
    chrome.runtime.openOptionsPage()
    return
  }

  let selectionText = ''
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString()?.slice(0, 2000) || '',
    })
    selectionText = results?.[0]?.result || ''
  } catch { /* chrome:// pages etc */ }

  const payload = {
    org_id: settings.orgId,
    business_id: null,
    signal_family: 'tabs_content',
    channel: 'browser_tab',
    source_system: 'chrome_ext',
    topic: tab.title || 'Browser tab',
    topics: [],
    summary: '',
    actions: [],
    tags: ['snap', 'tab'],
    importance_score: 0,
    time_window_start: new Date().toISOString(),
    time_window_end: null,
    primary_url: tab.url,
    raw_meta: {
      tab_title: tab.title,
      html_excerpt: selectionText,
      snap_source: 'toolbar_click',
    },
  }

  try {
    const res = await fetch(`${settings.apiBase}/api/v1/ingest/signal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (res.status === 201) {
      chrome.notifications.create({
        type: 'basic', iconUrl: 'icons/icon128.png',
        title: 'Snap saved ✓',
        message: tab.title || tab.url || 'Tab saved',
      })
      if (settings.autoClose) {
        chrome.tabs.remove(tab.id)
      }
    } else {
      const err = await res.json().catch(() => ({}))
      chrome.notifications.create({
        type: 'basic', iconUrl: 'icons/icon128.png',
        title: 'Snap failed',
        message: `HTTP ${res.status}: ${err?.error || 'Unknown error'}`,
      })
    }
  } catch (e) {
    chrome.notifications.create({
      type: 'basic', iconUrl: 'icons/icon128.png',
      title: 'Snap failed',
      message: 'Could not reach the Comet API.',
    })
  }
})
