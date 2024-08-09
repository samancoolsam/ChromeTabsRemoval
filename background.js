const MAX_TABS = 10;

chrome.tabs.onCreated.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({});

    if (tabs.length > MAX_TABS) {
      const tabProcessIds = tabs.map(tab => tab.id);
      const processInfo = await chrome.processes.getProcessInfo(tabProcessIds, true);

      const tabMemoryUsage = {};
      processInfo.forEach(info => {
        if (info && info.tabIds && info.tabIds.length) {
          info.tabIds.forEach(tabId => {
            tabMemoryUsage[tabId] = (tabMemoryUsage[tabId] || 0) + info.privateMemory;
          });
        }
      });

      const sortedTabs = tabs.sort((a, b) => (tabMemoryUsage[b.id] || 0) - (tabMemoryUsage[a.id] || 0));

      const tabsToHighlight = sortedTabs.slice(0, MAX_TABS);
      for (const tab of tabsToHighlight) {
        chrome.tabs.highlight({ tabs: tab.index });
      }

      const highestMemoryTab = sortedTabs[0];
      if (highestMemoryTab) {
        chrome.storage.local.set({
          highestMemoryTab: {
            title: highestMemoryTab.title,
            memoryUsage: tabMemoryUsage[highestMemoryTab.id] || 0
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching tabs:', error);
  }
});
