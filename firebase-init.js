// Check if Firebase is already initialized
if (typeof firebase === 'undefined' || !firebase.apps.length) {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDClVT8h1T6mBcfD4USQU3a6iINmyWTNmk",
        authDomain: "attendance-66f11.firebaseapp.com",
        databaseURL: "https://attendance-66f11-default-rtdb.firebaseio.com",
        projectId: "attendance-66f11",
        storageBucket: "attendance-66f11.appspot.com",
        messagingSenderId: "1041295884103",
        appId: "1:1041295884103:web:e7748b4c5a881e315b5662",
        measurementId: "G-7VNETMRH26"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

// Get references to Firebase services and make them global
window.auth = firebase.auth();
window.db = firebase.database(); 