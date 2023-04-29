// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHQJBs0pe_Yc17MBSqAGI5OUbigAGGHGs",
  authDomain: "frontendeiros-archimedes.firebaseapp.com",
  projectId: "frontendeiros-archimedes",
  storageBucket: "frontendeiros-archimedes.appspot.com",
  messagingSenderId: "482807980306",
  appId: "1:482807980306:web:0401641f775699d85493cb"
};

// Incializa o Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

//Define o provedor de autenticação
var provider = new firebase.auth.GoogleAuthProvider();