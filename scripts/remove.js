document.addEventListener('DOMContentLoaded', function() {
    // Retrieve entries from Local Storage or initialize if empty
    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Populate table and chart with existing entries
    const entriesList = document.getElementById('entriesList');
    entries.forEach((entry, index) => {
        addEntryToList(entry, index);
    });

    // Function to add an entry to the list in admin.html
    function addEntryToList(entry, index) {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `
            <span>${entry.name}</span>
            <button class="remove-btn" onclick="removeEntry(${index})">Remove</button>
        `;
        entriesList.appendChild(entryDiv);
    }

    // Function to remove an entry from the list and update table/chart
    window.removeEntry = function(index) {
        // Remove entry from entries array
        if (index >= 0 && index < entries.length) {
            entries.splice(index, 1);
            localStorage.setItem('entries', JSON.stringify(entries));

            // Update entries list in admin.html
            entriesList.innerHTML = '';
            entries.forEach((entry, idx) => {
                addEntryToList(entry, idx);
            });

            // Update table and chart display in kryss.html
            const iframe = document.getElementById('kryssFrame');
            if (iframe) {
                iframe.contentWindow.postMessage({ action: 'update', entries: entries }, '*');
            }
        }
    };
});
