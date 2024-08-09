document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('highestMemoryTab', (data) => {
        const displayDiv = document.getElementById('dataDisplay');
        if (data.highestMemoryTab) {
            displayDiv.innerHTML = `
                <p><strong>Title:</strong> ${data.highestMemoryTab.title}</p>
                <p><strong>Memory Usage:</strong> ${data.highestMemoryTab.memoryUsage.toFixed(2)} MB</p>
            `;
        } else {
            displayDiv.innerHTML = '<p>No data available</p>';
        }
    });
});
