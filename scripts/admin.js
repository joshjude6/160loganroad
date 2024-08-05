import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc, getDoc, updateDoc, setDoc, where, addDoc, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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
        const auth = getAuth();
        const db = getFirestore(app);

        const personMap = {
            peterSitater: "Peter",
            joshSitater: "Josh",
            philipSitater: "Philip"
        };
        const roomMap = {
            bathroom: "Badet",
            kitchen: "Kjøkkenet", 
            livingRoom: "Stua"
        };

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.isAdmin) {
                        document.getElementById('loadingMessage').style.display = 'none';
                        document.getElementById('adminContent').style.display = 'block';
                        populateDropdowns();
                    } else {
                        document.getElementById('loadingMessage').style.display = 'none';
                        document.getElementById('otherContent').style.display = 'block';
                    }
                } else {
                    console.log("No such document!");
                    window.location.href = 'login.html'; 
                }
            } else {
                alert("Logg inn først, jeg brukte lang tid på å fikse det...");
                window.location.href = 'login.html'; 
            }
        });

        async function populateDropdowns() {
            const usersDropdown = document.getElementById('usersDropdown');
            const roomsDropdown = document.getElementById('roomsDropdown');

            const usersSnapshot = await getDocs(collection(db, 'users'));
            usersSnapshot.forEach(userDoc => {
                const userData = userDoc.data();
                const option = document.createElement('option');
                option.value = userData.fornavn;
                option.textContent = userData.fornavn;
                usersDropdown.appendChild(option);
            });

            const roomsSnapshot = await getDocs(collection(db, 'vaskeliste'));
            roomsSnapshot.forEach(roomDoc => {
                const roomData = roomDoc.data();
                const option = document.createElement('option');
                option.value = roomDoc.id;
                option.textContent = roomMap[roomDoc.id];
                roomsDropdown.appendChild(option);
            });
        }

        document.getElementById("removeLastQuote").addEventListener('click', async function() {
            try {
                let lastQuoteDoc = null;
                const persons = Object.keys(personMap);

                for (const person of persons) {
                    const q = query(collection(db, 'sitater', person, 'quotes'), orderBy('time', 'desc'));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const firstDoc = querySnapshot.docs[0];
                        if (!lastQuoteDoc || firstDoc.data().time.toDate() > lastQuoteDoc.data().time.toDate()) {
                            lastQuoteDoc = firstDoc;
                        }
                    }
                }

                if (lastQuoteDoc) {
                    await deleteDoc(doc(db, lastQuoteDoc.ref.path));
                    alert("Siste sitat fjernet!");
                } else {
                    alert("Ingen sitater å fjerne.");
                }
            } catch (error) {
                console.error("Error removing last quote: ", error);
            }
        });

        document.getElementById("deleteAllQuotes").addEventListener('click', async function() {
            try {
                const persons = Object.keys(personMap);

                for (const person of persons) {
                    const q = query(collection(db, 'sitater', person, 'quotes'));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });
                }
                alert("Alle sitater slettet!");
            } catch (error) {
                console.error("Error deleting all quotes: ", error);
            }
        });

        document.getElementById("deletePersonQuotes").addEventListener('click', async function() {
            const person = document.getElementById("personDropdown").value;
            if (person) {
                try {
                    const q = query(collection(db, 'sitater', person, 'quotes'));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });
                    alert(`Alle sitatene til ${personMap[person]} har blitt slettet!`);
                } catch (error) {
                    console.error(`Error deleting quotes from ${personMap[person]}: `, error);
                }
            } else {
                alert("Velg en person, dummy.");
            }
        });

        document.getElementById('assignButton').onclick = async () => {
            const selectedUser = document.getElementById('usersDropdown').value;
            const selectedRoom = document.getElementById('roomsDropdown').value;

            const userDoc = await getDocs(collection(db, 'users'), where('fornavn', '==', selectedUser));
            const userId = userDoc.docs[0].id;

            await updateDoc(doc(db, 'vaskeliste', selectedRoom), { assignedTo: selectedUser });
            await updateDoc(doc(db, 'users', userId), { assignedRoom: selectedRoom });

            alert('Rommet har blitt tildelt en person!');
        }
        document.getElementById('resetRooms').onclick = async () => {
            const roomsSnapshot = await getDocs(collection(db, 'vaskeliste'));
            roomsSnapshot.forEach(async (roomDoc) => {
                await updateDoc(doc(db, 'vaskeliste', roomDoc.id), { status: false });
            });
            alert('Alle rom er dirty igjen :D!');
        }

        document.getElementById("removeLastKryss").addEventListener('click', async function() {
            const person = document.getElementById("personLastDropdown").value;
            const personLowerCase = person.toLowerCase();
            if (person) {
                try {
                    const kryssRef = collection(db, 'kryss', personLowerCase + 'Kryss', 'entries');
                    const kryssQuery = query(kryssRef, orderBy('time', 'desc'), limit(1));
                    const querySnapshot = await getDocs(kryssQuery);
                    if (!querySnapshot.empty) {
                        const kryssDoc = querySnapshot.docs[0];
                        await deleteDoc(doc(db, kryssDoc.ref.path));
                        alert(`Siste kryss til ${personMap[person]} har blitt fjernet!`);
                    } else {
                        alert(`Ingen kryss funnet for ${personMap[person]}.`);
                    }
                } catch (error) {
                    console.error(`Error removing last kryss from ${personMap[person]}: `, error);
                }
            } else {
                alert("Velg en person, dummy.");
            }
        });

        document.getElementById("addEventButton").addEventListener('click', async function() {
            const newEvent = document.getElementById("newEvent").value;
            if (newEvent) {
                try {
                    const eventDocRef = await addDoc(collection(db, 'events'), {
                        event: newEvent,
                        time: new Date()
                    });
                    alert("Ny hendelse lagt til!");
                    document.getElementById("newEvent").value = "";  // Clear the input field
                } catch (error) {
                    console.error("Error adding event: ", error);
                }
            } else {
                alert("Skriv inn en hendelse.");
            }
        });

        document.getElementById("removeOldestEventButton").addEventListener('click', async function() {
            try {
                const q = query(collection(db, 'events'), orderBy("time", "asc"), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const oldestEventDoc = querySnapshot.docs[0];
                    await deleteDoc(doc(db, 'events', oldestEventDoc.id));
                    alert("Eldste hendelse fjernet!");
                } else {
                    alert("Ingen hendelser å fjerne.");
                }
            } catch (error) {
                console.error("Error removing oldest event: ", error);
            }
        });
