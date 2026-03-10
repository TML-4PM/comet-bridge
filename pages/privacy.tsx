export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 680, margin: '48px auto', fontFamily: 'system-ui, sans-serif', padding: '0 24px', color: '#1a202c' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🌠 Snaps by Comet — Privacy Policy</h1>
      <p style={{ color: '#718096', marginBottom: 32 }}>Last updated: March 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>What we collect</h2>
        <p style={{ lineHeight: 1.7, color: '#4a5568' }}>
          When you click the Snaps by Comet toolbar button, the extension captures:
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: '#4a5568' }}>
          <li>The URL of the active tab</li>
          <li>The page title of the active tab</li>
          <li>Any text you have selected on the page (up to 2,000 characters)</li>
          <li>A timestamp</li>
        </ul>
        <p style={{ lineHeight: 1.7, color: '#4a5568', marginTop: 8 }}>
          This data is sent to the Comet Bridge API and stored in your organisation's Supabase database. 
          We do not collect data automatically — snaps are only created when you explicitly click the toolbar button.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>How we use it</h2>
        <p style={{ lineHeight: 1.7, color: '#4a5568' }}>
          Snap data is stored solely to provide the Tab Memory service: allowing you to review, search,
          and manage tabs you have saved. We do not sell, share, or use your snap data for advertising.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Data storage</h2>
        <p style={{ lineHeight: 1.7, color: '#4a5568' }}>
          Data is stored in Supabase (PostgreSQL) hosted in Australia. Your Organisation ID links your snaps
          to your account. API keys are stored locally in Chrome's <code>chrome.storage.sync</code> and are never 
          transmitted except as Bearer tokens to authenticate with the Bridge API.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Permissions used</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: '#4a5568' }}>
          <li><strong>tabs</strong> — to read the URL and title of the active tab</li>
          <li><strong>activeTab</strong> — to access the current tab on click</li>
          <li><strong>scripting</strong> — to read selected text from the page</li>
          <li><strong>storage</strong> — to save your Organisation ID and API Key locally</li>
          <li><strong>notifications</strong> — to show "Snap saved" confirmations</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Deletion</h2>
        <p style={{ lineHeight: 1.7, color: '#4a5568' }}>
          You can delete your snaps at any time via the Snaps dashboard or by contacting us. 
          Uninstalling the extension removes all locally stored settings immediately.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Contact</h2>
        <p style={{ lineHeight: 1.7, color: '#4a5568' }}>
          Tech 4 Humanity Ltd · ABN 61 605 746 618 · Sydney, Australia<br />
          Questions: <a href="mailto:hello@tech4humanity.com.au" style={{ color: '#6366f1' }}>hello@tech4humanity.com.au</a>
        </p>
      </section>
    </div>
  )
}
