document.addEventListener('DOMContentLoaded', async () => {
  const groupTabsBtn = document.getElementById('groupTabsBtn');
  const suspendOthersBtn = document.getElementById('suspendOthersBtn');
  const destroyDupsBtn = document.getElementById('destroyDupsBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const saveSessionBtn = document.getElementById('saveSessionBtn');
  const ioArea = document.getElementById('ioArea');
  const exportFormat = document.getElementById('exportFormat');
  const statusMessage = document.getElementById('statusMessage');
  const popupSessionsSection = document.getElementById('popupSessionsSection');
  const popupSessionsList = document.getElementById('popupSessionsList');

  const chromeColors = ['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan'];

  function showStatus(message) {
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden');
    setTimeout(() => statusMessage.classList.add('hidden'), 2500);
  }

  async function getTargetTabs() {
    const prefs = await chrome.storage.local.get({ activeWindowOnly: true, excludePinned: true });
    const query = prefs.activeWindowOnly ? { currentWindow: true } : {};
    let tabs = await chrome.tabs.query(query);
    if (prefs.excludePinned) tabs = tabs.filter(t => !t.pinned);
    return tabs;
  }

  async function loadSessions() {
    const { sessions } = await chrome.storage.local.get({ sessions: [] });
    if (!sessions || sessions.length === 0) {
      popupSessionsSection.classList.add('hidden');
      return;
    }
    
    popupSessionsSection.classList.remove('hidden');
    popupSessionsList.innerHTML = '';
    
    // Reverse array to show newly added sessions at the top
    const reversedSessions = [...sessions].reverse();
    
    reversedSessions.forEach(session => {
      const li = document.createElement('li');
      li.className = 'popup-session-item';
      li.innerHTML = `
        <span class="session-title-text" title="${session.name}">${session.name}</span>
        <button class="restore-btn" data-id="${session.id}">Restore</button>
      `;
      popupSessionsList.appendChild(li);
    });

    popupSessionsList.querySelectorAll('.restore-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const session = sessions.find(s => s.id === id);
        if (session) {
          chrome.windows.create({ url: session.tabs.map(t => t.url) });
        }
      });
    });
  }

  loadSessions();

  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Save Session from popup
  const popupSessionName = document.getElementById('popupSessionName');

  saveSessionBtn.addEventListener('click', async () => {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const savedTabs = tabs.map(t => ({ url: t.url, title: t.title }));
      const name = popupSessionName.value.trim() || `Session ${new Date().toLocaleString()}`;

      const currentPrefs = await chrome.storage.local.get({ sessions: [] });
      const updatedSessions = [...currentPrefs.sessions, { id: Date.now(), name, tabs: savedTabs }];

      await chrome.storage.local.set({ sessions: updatedSessions });
      popupSessionName.value = '';
      showStatus(`Saved ${savedTabs.length} tabs as session.`);
      loadSessions();
    } catch (e) {
      console.error(e);
      showStatus('Error saving session.');
    }
  });

  groupTabsBtn.addEventListener('click', async () => {
    try {
      const tabs = await getTargetTabs();
      const domainMap = {};

      tabs.forEach(tab => {
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) return;
        try {
          const domain = new URL(tab.url).hostname.replace(/^www\./, '');
          if (!domainMap[domain]) domainMap[domain] = [];
          domainMap[domain].push(tab.id);
        } catch (e) {}
      });

      for (const [domain, tabIds] of Object.entries(domainMap)) {
        if (tabIds.length > 1) { 
          const groupId = await chrome.tabs.group({ tabIds });
          const randomColor = chromeColors[Math.floor(Math.random() * chromeColors.length)];
          await chrome.tabGroups.update(groupId, { title: domain, color: randomColor });
        }
      }
      showStatus('Tabs grouped successfully!');
    } catch (e) {
      console.error(e);
      showStatus('Error grouping tabs.');
    }
  });

  suspendOthersBtn.addEventListener('click', async () => {
    try {
      const tabs = await chrome.tabs.query({ active: false });
      const prefs = await chrome.storage.local.get({ whitelist: [], excludePinned: true });
      let discardedCount = 0;

      for (const tab of tabs) {
        if (tab.discarded || tab.audible) continue;
        if (prefs.excludePinned && tab.pinned) continue;
        
        let whitelisted = false;
        try {
          const domain = new URL(tab.url).hostname;
          whitelisted = prefs.whitelist.some(w => domain.includes(w));
        } catch(e) {}

        if (!whitelisted) {
          await chrome.tabs.discard(tab.id);
          discardedCount++;
        }
      }
      showStatus(`Suspended ${discardedCount} tabs.`);
    } catch (e) {
      console.error(e);
    }
  });

  destroyDupsBtn.addEventListener('click', async () => {
    try {
      const tabs = await getTargetTabs();
      const seenUrls = new Set();
      const dupIds = [];

      tabs.forEach(tab => {
        if (seenUrls.has(tab.url)) dupIds.push(tab.id);
        else seenUrls.add(tab.url);
      });

      if (dupIds.length > 0) {
        await chrome.tabs.remove(dupIds);
        showStatus(`Closed ${dupIds.length} duplicates.`);
      } else {
        showStatus('No duplicates found.');
      }
    } catch (e) {
      console.error(e);
    }
  });

  exportBtn.addEventListener('click', async () => {
    try {
      const tabs = await getTargetTabs();
      const format = exportFormat.value;
      let output = "";

      if (format === 'markdown') {
        output = tabs.map(t => `[${t.title}](${t.url})`).join('\n');
      } else if (format === 'text') {
        output = tabs.map(t => `${t.title}\n${t.url}`).join('\n\n');
      } else if (format === 'csv') {
        output = 'Title,URL\n' + tabs.map(t => `"${t.title.replace(/"/g, '""')}","${t.url}"`).join('\n');
      } else if (format === 'html') {
        output = '<ul>\n' + tabs.map(t => `  <li><a href="${t.url}">${t.title}</a></li>`).join('\n') + '\n</ul>';
      }

      ioArea.value = output;
      await navigator.clipboard.writeText(output);
      showStatus('Copied to clipboard!');
    } catch (e) {
      console.error(e);
      showStatus('Export failed.');
    }
  });

  importBtn.addEventListener('click', () => {
    const input = ioArea.value;
    const urlRegex = /https?:\/\/[^\s"'<>\])]+/g;
    const urls = input.match(urlRegex);

    if (urls && urls.length > 0) {
      urls.forEach(url => chrome.tabs.create({ url, active: false }));
      showStatus(`Opening ${urls.length} links...`);
      ioArea.value = '';
    } else {
      showStatus('No valid URLs found in text.');
    }
  });
});