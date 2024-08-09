const MAX_TABS = 10;

chrome.tabs.onCreated.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({});
    
    // Fetch memory usage for each tab using the tabs API
    const tabMemoryUsage = {};
    for (const tab of tabs) {
      // Simulate RAM usage as a random value (replace with actual logic if available)
      tabMemoryUsage[tab.id] = Math.random() * 100; // Replace with real memory calculation if applicable
    }

    if (tabs.length > MAX_TABS) {
      // Sort tabs based on simulated memory usage
      const sortedTabs = tabs.sort((a, b) => (tabMemoryUsage[b.id] || 0) - (tabMemoryUsage[a.id] || 0));
      
      // Highlight the top tabs based on simulated memory usage
      const tabsToHighlight = sortedTabs.slice(0, MAX_TABS);
      for (const tab of tabsToHighlight) {
        chrome.tabs.highlight({ tabs: tab.index });
      }

      // Optionally, store the highest memory usage tab
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
