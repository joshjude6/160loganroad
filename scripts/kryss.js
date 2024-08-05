import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, where, updateDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
    
        const firebaseConfig = {
            apiKey: "AIzaSyA_PRc6DM_i3X5lar_vcRtQyr1YVDRNq_o",
            authDomain: "logan-road.firebaseapp.com",
            databaseURL: "https://logan-road-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "logan-road",
            storageBucket: "logan-road.appspot.com",
            messagingSenderId: "659456402188",
            appId: "1:659456402188:web:1c77d675d130038141df29",
            measurementId: "G-LHYYB4FNXF"
        };
    
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
    
        let chartInstance = null;
    
    document.getElementById("submitBtn").addEventListener('click', async function() {
    const name = document.getElementById("inputName").value;
    const reason = document.getElementById("hvorfor").value;
    const crosses = document.getElementById("antallKryss").value;
    const reporter = document.getElementById("hvemMeldte").value;

    if (name && reason && crosses && reporter) {
        try {
            console.log("Adding document to Firestore");
            const nameLowerCase = name.toLowerCase();
            const docRef = await addDoc(collection(db, 'kryss', nameLowerCase + 'Kryss', 'entries'), {
                name: name,
                reason: reason,
                crosses: Number(crosses),
                reporter: reporter,
                time: serverTimestamp()
            });
            console.log("Document added with ID: ", docRef.id);


            const userQuery = query(collection(db, 'users'), where('fornavn', '==', name));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {

                let userDoc;
                userSnapshot.forEach(doc => {
                    if (doc.data().fornavn === name) {
                        userDoc = doc;
                    }
                });

                if (userDoc) {
                    const userData = userDoc.data();
                    const newTotalCrosses = (userData.totalCrosses || 0) + Number(crosses);
                    await updateDoc(doc(db, 'users', userDoc.id), { totalCrosses: newTotalCrosses });
                    console.log("Crosses updated for user ID: ", userDoc.id);
                } else {
                    console.error("No user found with the exact first name match.");
                }
            } else {
                console.error("No user found with the given first name.");
            }

            alert("Kryss meldt!");
            displayEntries();
        } catch (error) {
            console.error("Error reporting crosses: ", error);
        }
    } else {
        alert("Fyll ut alle feltene 😡");
    }
    });



    
        async function displayEntries() {
            const entriesTableBody = document.getElementById('entriesTableBody');
            entriesTableBody.innerHTML = ''; // Clear existing entries
    
            let entriesArray = [];
            const persons = ["peterKryss", "joshKryss", "philipKryss"];
    
            for (const person of persons) {
                console.log("Fetching entries for: ", person);
                const q = query(collection(db, 'kryss', person, 'entries'), orderBy('time', 'desc'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    entriesArray.push(doc.data());
                });
            }
    
            console.log("Entries fetched: ", entriesArray);
    
            entriesArray.sort((a, b) => b.time.toDate() - a.time.toDate());
    
            entriesArray.forEach((entry) => {
                const date = entry.time.toDate();
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                entriesTableBody.innerHTML += `
                    <tr>
                        <td>${entry.name}</td>
                        <td>${entry.reason}</td>
                        <td>${entry.crosses}</td>
                        <td>${entry.reporter}</td>
                    </tr>
                `;
            });
    
            console.log("Entries displayed in table");
            displayChart(entriesArray);
        }
    
        function displayChart(entriesArray) {
            const ctx = document.getElementById('myChart').getContext('2d');
    
            const names = ["Peter", "Josh", "Philip"];
            const crossesData = [0, 0, 0];
    
            entriesArray.forEach((entry) => {
                const index = names.indexOf(entry.name);
                if (index !== -1) {
                    crossesData[index] += entry.crosses;
                }
            });
    
            if (chartInstance) {
                chartInstance.destroy();
            }
    
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: names,
                    datasets: [{
                        label: 'Antall kryss',
                        data: crossesData,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            console.log("Chart updated");
        }
    
        displayEntries();
