document.addEventListener('DOMContentLoaded', async () => {
  const activeWindowOnly = document.getElementById('activeWindowOnly');
  const excludePinned = document.getElementById('excludePinned');
  const suspendTimer = document.getElementById('suspendTimer');
  const whitelistArea = document.getElementById('whitelistArea');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const saveStatus = document.getElementById('saveStatus');

  const sessionName = document.getElementById('sessionName');
  const saveSessionBtn = document.getElementById('saveSessionBtn');
  const sessionsList = document.getElementById('sessionsList');

  // Load configuration
  const prefs = await chrome.storage.local.get({
    activeWindowOnly: true,
    excludePinned: true,
    suspendTimer: 0,
    whitelist: [],
    sessions: []
  });

  activeWindowOnly.checked = prefs.activeWindowOnly;
  excludePinned.checked = prefs.excludePinned;
  suspendTimer.value = prefs.suspendTimer;
  whitelistArea.value = prefs.whitelist.join('\n');

  renderSessions(prefs.sessions);

  // Save Settings
  saveSettingsBtn.addEventListener('click', async () => {
    const whitelist = whitelistArea.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    await chrome.storage.local.set({
      activeWindowOnly: activeWindowOnly.checked,
      excludePinned: excludePinned.checked,
      suspendTimer: parseInt(suspendTimer.value) || 0,
      whitelist: whitelist
    });

    saveStatus.classList.remove('hidden');
    setTimeout(() => saveStatus.classList.add('hidden'), 2500);
  });

  // Feature 4: Session Saving
  saveSessionBtn.addEventListener('click', async () => {
    const name = sessionName.value.trim() || `Session ${new Date().toLocaleString()}`;
    const tabs = await chrome.tabs.query({ currentWindow: true });
    
    const savedTabs = tabs.map(t => ({ url: t.url, title: t.title }));
    
    const currentPrefs = await chrome.storage.local.get({ sessions: [] });
    const updatedSessions = [...currentPrefs.sessions, { id: Date.now(), name, tabs: savedTabs }];
    
    await chrome.storage.local.set({ sessions: updatedSessions });
    sessionName.value = '';
    renderSessions(updatedSessions);
  });

  function renderSessions(sessions) {
    sessionsList.innerHTML = '';
    sessions.forEach(session => {
      const li = document.createElement('li');
      li.className = 'session-item';
      
      const info = document.createElement('div');
      info.className = 'session-info';
      info.innerHTML = `<strong>${session.name}</strong><span>${session.tabs.length} tabs</span>`;
      
      const actions = document.createElement('div');
      actions.className = 'session-actions';

      const restoreBtn = document.createElement('button');
      restoreBtn.className = 'outline-btn restore';
      restoreBtn.textContent = 'Restore';
      restoreBtn.addEventListener('click', () => {
        chrome.windows.create({ url: session.tabs.map(t => t.url) });
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'outline-btn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        const { sessions: currentSessions } = await chrome.storage.local.get({ sessions: [] });
        const filtered = currentSessions.filter(s => s.id !== session.id);
        await chrome.storage.local.set({ sessions: filtered });
        renderSessions(filtered);
      });

      actions.appendChild(restoreBtn);
      actions.appendChild(delBtn);
      li.appendChild(info);
      li.appendChild(actions);
      sessionsList.appendChild(li);
    });
  }
});