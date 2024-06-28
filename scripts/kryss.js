// kryss.js
import { db } from './firebase.js';
import { ref, get, set, push, onValue } from "firebase/database";

document.addEventListener('DOMContentLoaded', function() {
    const entriesTableBody = document.getElementById('entriesTableBody');
    const ctx = document.getElementById('myChart').getContext('2d');

    let chartData = {
        labels: ['Peter', 'Josh', 'Philip'],
        datasets: [{
            label: 'Antall kryss',
            data: [0, 0, 0],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1
        }]
    };

    let myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const entriesRef = ref(db, 'entries');

    onValue(entriesRef, (snapshot) => {
        const entries = snapshot.val() || [];
        entriesTableBody.innerHTML = '';
        chartData.labels = ['Peter', 'Josh', 'Philip'];
        chartData.datasets[0].data = [0, 0, 0];
        
        entries.forEach(entry => {
            updateTableAndChart(entry.name, entry.reason, entry.kryss, entry.meldte);
        });
    });

    function updateChartData(name, kryss) {
        const index = chartData.labels.indexOf(name);
        if (index !== -1) {
            chartData.datasets[0].data[index] += kryss;
        } else {
            chartData.labels.push(name);
            chartData.datasets[0].data.push(kryss);
            chartData.datasets[0].backgroundColor.push(getRandomColor());
            chartData.datasets[0].borderColor.push(getRandomColor());
        }
        myChart.update();
    }

    function updateTableAndChart(name, reason, kryss, meldte) {
        let row = entriesTableBody.insertRow();
        row.innerHTML = `<td>${name}</td><td>${reason}</td><td>${kryss}</td><td>${meldte}</td>`;

        let cells = row.getElementsByTagName("td");
        for (let cell of cells) {
            cell.style.backgroundColor = 'white';
            cell.style.color = 'black';
        }

        updateChartData(name, kryss);
    }

    function saveToDatabase(name, reason, kryss, meldte) {
        const newEntryRef = push(entriesRef);
        set(newEntryRef, {
            name: name,
            reason: reason,
            kryss: kryss,
            meldte: meldte
        });
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const inputName = document.getElementById('inputName').value.trim();
        const hvorfor = document.getElementById('hvorfor').value.trim();
        const antallKryss = parseInt(document.getElementById('antallKryss').value);
        const hvemMeldte = document.getElementById('hvemMeldte').value.trim();

        if (inputName && hvorfor && !isNaN(antallKryss) && hvemMeldte) {
            updateTableAndChart(inputName, hvorfor, antallKryss, hvemMeldte);
            saveToDatabase(inputName, hvorfor, antallKryss, hvemMeldte);

            document.getElementById('inputName').value = '';
            document.getElementById('hvorfor').value = '';
            document.getElementById('antallKryss').value = '';
            document.getElementById('hvemMeldte').value = '';
        } else {
            alert('Fyll inn alle felter korrekt!');
        }
    });
});
