// Check for inactive tabs every minute
chrome.alarms.create("autoSuspendAlarm", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "autoSuspendAlarm") {
    try {
      const { suspendTimer, whitelist, excludePinned } = await chrome.storage.local.get({
        suspendTimer: 0,
        whitelist: [],
        excludePinned: true
      });

      // If auto-suspend is disabled
      if (suspendTimer <= 0) return;

      const tabs = await chrome.tabs.query({});
      const now = Date.now();
      const suspendThreshold = suspendTimer * 60 * 1000;

      for (const tab of tabs) {
        if (tab.active || tab.discarded || tab.audible) continue;
        if (excludePinned && tab.pinned) continue;

        try {
          const urlObj = new URL(tab.url);
          const isWhitelisted = whitelist.some(domain => urlObj.hostname.includes(domain));
          if (isWhitelisted) continue;
        } catch(e) {
          continue; 
        }

        if (tab.lastAccessed && (now - tab.lastAccessed > suspendThreshold)) {
          chrome.tabs.discard(tab.id);
        }
      }
    } catch (err) {
      console.error("TabFold Auto-Suspend Error:", err);
    }
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "export-markdown") {
    try {
      const { excludePinned } = await chrome.storage.local.get({ excludePinned: true });
      const queryParams = { currentWindow: true };
      if (excludePinned) queryParams.pinned = false;

      const tabs = await chrome.tabs.query(queryParams);
      const markdown = tabs.map(t => `[${t.title}](${t.url})`).join("\n");

      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab && !activeTab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: (text) => navigator.clipboard.writeText(text),
          args: [markdown]
        });
      }
    } catch (err) {
      console.error("TabFold Export Error:", err);
    }
  }
});