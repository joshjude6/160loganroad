document.addEventListener('DOMContentLoaded', function() {
    const entriesTableBody = document.getElementById('entriesTableBody');
    const ctx = document.getElementById('myChart').getContext('2d');

    // Initialize chart data with default labels and empty data
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

    // Initialize Chart.js instance
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

    // Retrieve entries from Local Storage
    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Populate table and update chart with existing entries
    entries.forEach(entry => {
        updateTableAndChart(entry.name, entry.reason, entry.kryss, entry.meldte);
    });

    // Function to update chart data
    function updateChartData(name, kryss) {
        const index = chartData.labels.indexOf(name);
        if (index !== -1) {
            chartData.datasets[0].data[index] += kryss;
        } else {
            // If name not found in labels, add it and update data
            chartData.labels.push(name);
            chartData.datasets[0].data.push(kryss);
            chartData.datasets[0].backgroundColor.push(getRandomColor());
            chartData.datasets[0].borderColor.push(getRandomColor());
        }
        myChart.update();
    }

    // Function to update table and chart
    function updateTableAndChart(name, reason, kryss, meldte) {
        // Update table
        let row = entriesTableBody.insertRow();
        row.innerHTML = `<td>${name}</td><td>${reason}</td><td>${kryss}</td><td>${meldte}</td>`;

        // Apply styles to the newly added row
        let cells = row.getElementsByTagName("td");
        for (let cell of cells) {
            cell.style.backgroundColor = 'white';
            cell.style.color = 'black';
        }

        // Update chart data
        updateChartData(name, kryss);
    }

    // Function to save new entry to Local Storage
    function saveToLocalStorage(name, reason, kryss, meldte) {
        let entries = JSON.parse(localStorage.getItem('entries')) || [];

        let newEntry = {
            name: name,
            reason: reason,
            kryss: kryss,
            meldte: meldte
        };

        entries.push(newEntry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    // Event listener for submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission

        const inputName = document.getElementById('inputName').value.trim();
        const hvorfor = document.getElementById('hvorfor').value.trim();
        const antallKryss = parseInt(document.getElementById('antallKryss').value);
        const hvemMeldte = document.getElementById('hvemMeldte').value.trim();

        if (inputName && hvorfor && !isNaN(antallKryss) && hvemMeldte) {
            updateTableAndChart(inputName, hvorfor, antallKryss, hvemMeldte);
            saveToLocalStorage(inputName, hvorfor, antallKryss, hvemMeldte);

            // Clear input fields
            document.getElementById('inputName').value = '';
            document.getElementById('hvorfor').value = '';
            document.getElementById('antallKryss').value = '';
            document.getElementById('hvemMeldte').value = '';
        } else {
            alert('Fyll inn alle felter korrekt!');
        }
    });
});
