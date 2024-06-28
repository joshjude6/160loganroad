// reset.js
import { db } from './firebase.js';
import { ref, set } from "firebase/database";

document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetBtn');

    resetBtn.addEventListener('click', function() {
        const entriesRef = ref(db, 'entries');

        set(entriesRef, []);

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
    });
});
