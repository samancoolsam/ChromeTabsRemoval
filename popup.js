document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get('highestMemoryTab', function (data) {
    if (data.highestMemoryTab) {
      const tabTitleElement = document.getElementById('tab-title');
      const memoryUsageElement = document.getElementById('tab-memory-usage');

      tabTitleElement.textContent = `Title: ${data.highestMemoryTab.title}`;
      memoryUsageElement.textContent = `Memory Usage: ${formatBytes(data.highestMemoryTab.memoryUsage)}`;
    } else {
      document.getElementById('tab-title').textContent = 'No data available';
    }
  });
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
