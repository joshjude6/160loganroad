// remove.js
import { db } from './firebase.js';
import { ref, get, set, onValue } from "firebase/database";

document.addEventListener('DOMContentLoaded', function() {
    const entriesList = document.getElementById('entriesList');
    const entriesRef = ref(db, 'entries');

    onValue(entriesRef, (snapshot) => {
        const entries = snapshot.val() || [];
        entriesList.innerHTML = '';
        entries.forEach((entry, index) => {
            addEntryToList(entry, index);
        });
    });

    function addEntryToList(entry, index) {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `
            <span>${entry.name}</span>
            <button class="remove-btn" onclick="removeEntry(${index})">Remove</button>
        `;
        entriesList.appendChild(entryDiv);
    }

    window.removeEntry = function(index) {
        get(entriesRef).then((snapshot) => {
            const entries = snapshot.val() || [];
            if (index >= 0 && index < entries.length) {
                entries.splice(index, 1);
                set(entriesRef, entries);

                entriesList.innerHTML = '';
                entries.forEach((entry, idx) => {
                    addEntryToList(entry, idx);
                });

                const iframe = document.getElementById('kryssFrame');
                if (iframe) {
                    iframe.contentWindow.postMessage({ action: 'update', entries: entries }, '*');
                }
            }
        });
    };
});
