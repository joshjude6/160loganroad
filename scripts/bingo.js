import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

    
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
    const storage = getStorage(app);
    const auth = getAuth(app);
    const bingoContainer = document.querySelector('.bingo');
    const uploadModal = document.getElementById('uploadModal');
    const photoInput = document.getElementById('photoInput');
    let currentSquare = null;


    async function fetchBingoData() {
        const bingoQuery = collection(db, 'bingo');
        const bingoSnapshot = await getDocs(bingoQuery);
        const bingoData = bingoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        displayBingoGrid(bingoData);
    }


    function displayBingoGrid(bingoData) {
        bingoContainer.innerHTML = '';
        bingoData.forEach((square, index) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add('square');
            squareElement.textContent = square.activity;
            //squareElement.style.textDecoration = square.completed ? 'line-through' : 'none';
            squareElement.style.backgroundColor = square.completed ? '#26a65b' : '#f2f2f2';
            squareElement.addEventListener('click', () => handleSquareClick(square));
            bingoContainer.appendChild(squareElement);
        });
    }


    function handleSquareClick(square) {
        if(!square.completed && auth.currentUser){
            if (confirm(`Skal "${square.activity}" markeres som ferdig?`)) {
            currentSquare = square;
            uploadModal.style.display = 'block';
        }
        } else {
            alert("Allerede merket som ferdig! Kontakt admin for fix!");
        }
        
    }
    document.getElementById("uploadPhotos").addEventListener('click', async function() {
        const file = photoInput.files[0];
        if (!file) return;
        const activityName = currentSquare.activity;
        const storageRef = ref(storage, `bingo/${activityName}/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'bingo', currentSquare.id), {
            completed: true,
            photoURL: photoURL,
            time: serverTimestamp()
        });
        console.log("Photo uploaded!", currentSquare.id)
        uploadModal.style.display = 'none';
        fetchBingoData();
    });
    
    document.getElementById("closeModals").addEventListener('click', async function () {
        uploadModal.style.display = 'none';
    });

    async function initializeBingoCollection() {
        const bingoCollection = collection(db, 'bingo');
        const bingoSnapshot = await getDocs(bingoCollection);

        if (bingoSnapshot.empty) {
            for (let i = 0; i < 25; i++) {
                const squareDoc = doc(bingoCollection, `square_${i + 1}`);
                await setDoc(squareDoc, {
                    activity: `Square ${i + 1}`,
                    completed: false
                });
            }
            console.log('Bingo collection initialized.');
        } else {
            console.log('Bingo collection already exists.');
        }
    }

    initializeBingoCollection().then(() => fetchBingoData());