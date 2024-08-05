import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection, where, addDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


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

    async function fetchLastThreeSubmissions() {
        const invitationsDiv = document.getElementById("invitations");
        const invitationOne = document.getElementById("invitationOne");
        const invitationTwo = document.getElementById("invitationTwo");
        const invitationThree = document.getElementById("invitationThree");

        invitationOne.innerText = "";
        invitationTwo.innerText = "";
        invitationThree.innerText = "";

        try {
            const q = query(collection(db, 'sosialt', 'hendelse', 'entries'), orderBy("time", "desc"), limit(3));
            const querySnapshot = await getDocs(q);
            const invitations = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                invitations.push(`${data.who} inviterer til ${data.what}, ${data.when}`);
            });
            if (invitations[0]) invitationOne.innerText = invitations[0];
            if (invitations[1]) invitationTwo.innerText = invitations[1];
            if (invitations[2]) invitationThree.innerText = invitations[2];
        } catch (error) {
            console.error("Error fetching submissions: ", error);
        }
    }

    try {
        fetchLastThreeSubmissions();
    } catch(error){
        console.error("Failed to fetch submission: ", error)
    }
    function countDownTimer(){
        var countDownDate = new Date("Nov 19, 2024 07:00:00").getTime();
        var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("seoul").innerHTML = days + " dager, " + hours + " timer, " + minutes + " minutter, og " + seconds + " sekunder! ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("seoul").innerHTML = "갑시다!😍";
        }}, 1000);
    }
    function peterTimer(){
        var countDownDate = new Date("Aug 05, 2024 23:45:00").getTime();
        var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("peterCounter").innerHTML = days + " dager, " + hours + " timer, " + minutes + " minutter, og " + seconds + " sekunder! ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("peterCounter").innerHTML = "Velkommen til Brisbane, Peter!😍";
        }}, 1000);
    }
    countDownTimer();
    peterTimer();
    async function fetchLastThreeEvents() {
    const eventsDiv = document.getElementById("events");
    eventsDiv.innerHTML = ""; // Clear current events

    try {
        const q = query(collection(db, 'events'), orderBy("time", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const eventParagraph = document.createElement("li");
            eventParagraph.textContent = data.event;
            eventsDiv.appendChild(eventParagraph);
        });
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
    }

fetchLastThreeEvents();
    async function fetchUserData() {
            const userTableBody = document.getElementById("userTable").getElementsByTagName('tbody')[0];

            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const row = document.createElement("tr");

                    const fornavnCell = document.createElement("td");
                    fornavnCell.textContent = data.fornavn;
                    row.appendChild(fornavnCell);

                    const recycleCountCell = document.createElement("td");
                    recycleCountCell.textContent = data.recycleCount;
                    row.appendChild(recycleCountCell);

                    const wasteCountCell = document.createElement("td");
                    wasteCountCell.textContent = data.wasteCount;
                    row.appendChild(wasteCountCell);

                    const dishCountCell = document.createElement("td");
                    dishCountCell.textContent = data.dishCount;
                    row.appendChild(dishCountCell);

                    userTableBody.appendChild(row);
                });
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        }

fetchUserData();
async function displayMostRecentImage() {
      try {
        const querySnapshot = await query(collection(db, 'bingo'), orderBy("time", "asc"));
        const q = await getDocs(querySnapshot)
        let mostRecentPhotoURL = '';
        let photoActivity = '';
        q.forEach((doc) => {
          const data = doc.data();
          if (data.time && data.photoURL) {
            mostRecentPhotoURL = data.photoURL;
            photoActivity = data.activity;
            return false; // Exit the loop once the most recent valid entry is found
          }
        });

        if (mostRecentPhotoURL) {
          const imageContainer = document.getElementById('image-container');
          const imageTitle = document.getElementById('imageTitle');
          imageContainer.innerHTML = `<img src="${mostRecentPhotoURL}" alt="Nyligste bilde" style="width: 250px;">`;
          imageTitle.innerHTML = `<p>Aktivitet: ${photoActivity}</p>`;
        } else {
          console.log('No valid entry with photoURL found.');
        }
      } catch (error) {
        console.error('Error retrieving documents:', error);
      }
    }

    displayMostRecentImage();
