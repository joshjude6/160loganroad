import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
    
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
    const cleaningScheduleDiv = document.getElementById('cleaningSchedule');
    const statusText = document.getElementById('status');

    const roomMap = {
        bathroom: "Badet",
        kitchen: "Kjøkkenet", 
        livingRoom: "Stua"
    }

    async function loadCleaningSchedule() {
        const roomsSnapshot = await getDocs(collection(db, 'vaskeliste'));
        let allClean = true;
        roomsSnapshot.forEach(roomDoc => {
            const roomData = roomDoc.data();
            cleaningScheduleDiv.innerHTML += `<h2>${roomMap[roomDoc.id]}</h2>`;
            cleaningScheduleDiv.innerHTML += `<p>Ansvarlig person: ${roomData.assignedTo}</p>`;
            cleaningScheduleDiv.innerHTML += `<p>Status: ${roomData.status ? 'Ferdig! :D' : 'Ikke ferdig >:('}</p>`;
            if (!roomData.status) allClean = false;
        });

        if (allClean) {
            statusText.textContent = 'Leiligheten er ren og pen!😍';
            statusText.style.color = 'green';
        } else {
            statusText.textContent = 'Leiligheten er dirty, og ikke på den morsomme måten 😳';
            statusText.style.color = 'red';
        }
    }

    loadCleaningSchedule();
