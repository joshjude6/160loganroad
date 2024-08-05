import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection, where, addDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
    const greeting = document.getElementById('greeting');
    const roomTasksDiv = document.getElementById('roomTasks');
    const markAsDoneButton = document.getElementById('markAsDoneButton');
    const kryssMarker = document.getElementById('kryssMarker');
    const socialButton = document.getElementById('socialButton');
    const socialButtons = document.getElementById('socialButtons');
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                greeting.textContent = `Velkommen til siden din, ${userData.fornavn}! Her er oppgavene dine for uka.`;
                kryssMarker.textContent = `Du har ${userData.totalCrosses} kryss!`;
                socialButtons.style.display = "block";
                console.log("All text loaded");
                document.getElementById("socialButton").addEventListener('click', async function() {
                const what = document.getElementById("what").value;
                const when = document.getElementById("when").value;
                if (what && when) {
                    try {
                        console.log("Adding social event to Firestore");
                        const docRef = await addDoc(collection(db, 'sosialt', 'hendelse', 'entries'), {
                            what: what,
                            when: when,
                            who: userData.fornavn,
                            time: serverTimestamp()
                        });
                        console.log("Social event added with ID: ", docRef.id);
                        alert("Sendt inn sosial event!")

                    } catch (error) {
                        console.error("Error reporting event: ", error);
                    }
                } else {
                    alert("Fyll ut alle feltene 😡");
                }
                });
 
                const roomQuery = await getDocs(collection(db, 'vaskeliste'), where('assignedTo', '==', user.fornavn));
                console.log(roomQuery)
                if (!roomQuery.empty) {
                    const roomDoc = roomQuery.docs[0];
                    const roomData = roomDoc.data();
                    const roomPath = roomDoc.ref.path;
                    
                    displayRoomTasks(roomData, roomPath);

      
                    markAsDoneButton.style.display = 'block';
                    markAsDoneButton.onclick = () => markRoomAsDone(roomDoc.id);
                } else {
                    roomTasksDiv.textContent = 'No room assigned.';
                }
            } else {
                console.log("No such document!");
            }
        } else {
            alert("Logg inn først, dummy.");
            window.location.href = 'login.html'; 
        }
    });

    const roomMap = {
        bathroom: "Badet",
        kitchen: "Kjøkkenet", 
        livingRoom: "Stua"
    }

    function displayRoomTasks(roomData, roomPath) {
        console.log(roomData)
        const roomName = roomMap[roomPath.split('/')[1]];
        roomTasksDiv.innerHTML = `<h2>Ditt tildelte rom for uka: ${roomName}</h2>`;
        roomTasksDiv.innerHTML += '<ul>';
        roomData.tasks.forEach(task => {
            roomTasksDiv.innerHTML += `<li>${task}</li>`;
        });
        roomTasksDiv.innerHTML += '</ul>';
    }

    async function markRoomAsDone(roomId) {
        try {
            await updateDoc(doc(db, 'vaskeliste', roomId), { status: true });
            alert('Rom markert som fullført! Thank you for your service😍!');
        } catch (error) {
            console.error("Error marking room as done: ", error);
        }
    }


    async function updateCount(countType) {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, 'users', user.uid);
        try {
        await updateDoc(userRef, {
            [countType]: increment(1)
        });
        alert(countType + " oppdatert!");
        console.log(countType + ' updated successfully');
        } catch (error) {
        console.error('Error updating ' + countType + ': ', error);
        }
    } else {
        console.log('No user is signed in');
    }
    }
    document.getElementById('recycleButton').addEventListener('click', () => {
      updateCount('recycleCount');
    });

    document.getElementById('wasteButton').addEventListener('click', () => {
      updateCount('wasteCount');
    });

    document.getElementById('dishButton').addEventListener('click', () => {
      updateCount('dishCount');
    });
