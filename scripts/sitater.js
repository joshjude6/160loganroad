import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
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
        const personMap = {
            peterSitater: "Peter",
            joshSitater: "Josh",
            philipSitater: "Philip"
        };
        // sjekker at alt er good
        console.log("Firebase initialized.")
        console.log(firebaseConfig);
        console.log(db);
        // alt er good!
        document.getElementById("submitQuote").addEventListener('click', async function() {
            const person = document.getElementById("personDropdown").value;
            const quote = document.getElementById("quoteInput").value;
            if (person && quote) {
                try {
                    const docRef = await addDoc(collection(db, 'sitater', person, 'quotes'), {
                        sitat: quote,
                        time: serverTimestamp()
                    });
                    alert("Sitat sendt inn! Aner du hvor lang tid jeg brukte på å implementere denne veldig enkle funksjonen?");
                    displayQuotes();
                } catch (error) {
                    console.error("Error saving quote: ", error);
                }
            } else {
                alert("Du må velge en person/skrive et sitat, nørd.");
            }
        });
        async function displayQuotes() {
            const quotesList = document.getElementById('quotesList');
            quotesList.innerHTML = ''; 
            
            let quotesArray = [];
            const persons = Object.keys(personMap);

            for (const person of persons) {
                const q = query(collection(db, 'sitater', person, 'quotes'), orderBy('time', 'desc'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    quotesArray.push({
                        person: personMap[person], 
                        sitat: doc.data().sitat,
                        time: doc.data().time
                    });
                });
            }

            quotesArray.sort((a, b) => b.time.toDate() - a.time.toDate());

            let table = '<table>';
            table += '<tr><th>Person</th><th>Sitat</th><th>Tidspunkt</th></tr>';
            quotesArray.forEach((quote) => {
                const date = quote.time.toDate();
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                table += `<tr><td>${quote.person}</td><td>${quote.sitat}</td><td>${formattedDate}</td></tr>`;
            });
            table += '</table>';
            quotesList.innerHTML = table;
        }
        displayQuotes();

