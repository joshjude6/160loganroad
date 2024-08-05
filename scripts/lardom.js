import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
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

    document.getElementById("submitTip").addEventListener('click', async function() {
        const tip = document.getElementById("tipInput").value;
        if (tip) {
            try {
                await addDoc(collection(db, 'tips'), {
                    tip: tip,
                    time: serverTimestamp()
                });
                document.getElementById("tipInput").value = ''; // Clear input field
                loadTips(); // Refresh the tips list
                alert("Tips sendt inn!");
            } catch (error) {
                console.error("Error saving tip: ", error);
            }
        } else {
            alert("Du må skrive inn et tips!");
        }
    });

    async function loadTips() {
        const q = query(collection(db, 'tips'), orderBy('time', 'desc'));
        const querySnapshot = await getDocs(q);
        const tipsTableBody = document.getElementById("tipsTable").getElementsByTagName("tbody")[0];
        tipsTableBody.innerHTML = ''; // Clear existing tips
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = tipsTableBody.insertRow();
            row.insertCell(0).textContent = data.tip;
        });
    }

    function formatTimestamp(timestamp) {
        const hours = timestamp.getHours().toString().padStart(2, '0');
        const minutes = timestamp.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }


    window.onload = loadTips;
