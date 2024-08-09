const MAX_TABS = 10;

chrome.tabs.onCreated.addListener(async () => {
  const tabs = await chrome.tabs.query({});

  if (tabs.length > MAX_TABS) {
    // Get process information for all tabs
    const tabProcessIds = tabs.map(tab => tab.id);
    const processInfo = await chrome.processes.getProcessInfo(tabProcessIds, true);

    // Create a map of tabId to memory usage
    const tabMemoryUsage = {};
    processInfo.forEach(info => {
      if (info && info.tabIds && info.tabIds.length) {
        info.tabIds.forEach(tabId => {
          tabMemoryUsage[tabId] = (tabMemoryUsage[tabId] || 0) + info.privateMemory;
        });
      }
    });

    // Sort tabs by memory usage in descending order
    const sortedTabs = tabs.sort((a, b) => (tabMemoryUsage[b.id] || 0) - (tabMemoryUsage[a.id] || 0));

    // Highlight the tabs with the highest memory usage
    const tabsToHighlight = sortedTabs.slice(0, MAX_TABS);
    for (const tab of tabsToHighlight) {
      chrome.tabs.highlight({ tabs: tab.index });
    }

    // Store the tab with the highest RAM usage in chrome.storage
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
});
