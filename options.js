chrome.storage.sync.get(['orgId', 'apiKey', 'apiBase', 'autoClose'], (s) => {
  if (s.orgId)    document.getElementById('orgId').value    = s.orgId
  if (s.apiKey)   document.getElementById('apiKey').value   = s.apiKey
  if (s.apiBase)  document.getElementById('apiBase').value  = s.apiBase
  if (s.autoClose !== undefined) document.getElementById('autoClose').value = String(s.autoClose)
})

document.getElementById('save').addEventListener('click', () => {
  const orgId     = document.getElementById('orgId').value.trim()
  const apiKey    = document.getElementById('apiKey').value.trim()
  const apiBase   = document.getElementById('apiBase').value.trim().replace(/\/$/, '')
  const autoClose = document.getElementById('autoClose').value === 'true'

  chrome.storage.sync.set({ orgId, apiKey, apiBase, autoClose }, () => {
    const s = document.getElementById('status')
    s.textContent = '✓ Settings saved'
    setTimeout(() => { s.textContent = '' }, 2500)
  })
})
