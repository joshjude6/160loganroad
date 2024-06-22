// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_PRc6DM_i3X5lar_vcRtQyr1YVDRNq_o",
  authDomain: "logan-road.firebaseapp.com",
  projectId: "logan-road",
  storageBucket: "logan-road.appspot.com",
  messagingSenderId: "659456402188",
  appId: "1:659456402188:web:2cf534108731af9d41df29",
  measurementId: "G-GMRKY7QZMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

