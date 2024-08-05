import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, setDoc, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
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
    const auth = getAuth(app);
    const db = getFirestore(app);

    document.getElementById('loginButton').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'user.html'; // Redirect to user page on successful login
        } catch (error) {
            console.error("Feil ved login: ", error.message);
            alert("Login mislyktes, fyf. Sjekk at du ikke skrev noe feil.");
        }
    });

    document.getElementById('registerButton').addEventListener('click', async () => {
        const fornavn = document.getElementById('fornavn').value;
        const etternavn = document.getElementById('etternavn').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Passordene stemmer ikke overens.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                fornavn: fornavn,
                etternavn: etternavn,
                email: email,
                isAdmin: false,
                assignedRoom: "none",
                totalCrosses: 0,
                recycleCount: 0,
                wasteCount: 0,
                dishCount: 0
            });
            window.location.href = 'user.html'; // Redirect to user page on successful registration
        } catch (error) {
            console.error("Error registering user: ", error.message);
            alert("Registrering mislyktes. Prøv igjen og prøv hardere.");
        }
    });

    document.getElementById('logoutButton').addEventListener('click', async () => {
    signOut(auth).then(() => {
        alert("Du har logget ut! Hadet :)")
    }).catch((error) => {
        console.error("Logout failed.")
    }); 
    });
