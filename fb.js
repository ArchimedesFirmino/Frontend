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

// Importa o "core" do Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

// Importa o Authentication do Firebase.
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Initializa o Firebase.
const fbapp = initializeApp(firebaseConfig);

// Inicializa o mecanismo de autenticação.
const auth = getAuth();

// Especifica o provedor de autenticação.
const provider = new GoogleAuthProvider();

//signInWithPopup(auth, provider)

onAuthStateChanged(auth, (user) => {
    if (user) {
        sessionStorage.userData = JSON.stringify({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
        })
    } else {
        delete sessionStorage.userData
    }
});

// Executa a jQuery quando o documento estiver pronto.
$(document).ready(myFirebase)

function myFirebase() {

    // Detecta cliques no botão de login.
    $('#navUser').click(login)
}

// Função que processa cliques no botão login/profile.
function login() {

    // Se não está logado...
    if (!sessionStorage.userData) {

        // Faz login usando popup.
        signInWithPopup(auth, provider)

            // Se logou corretamente.
            .then(() => {

                // Redireciona para a 'home'.
                location.href = '/home'
            })

        // Se está logado..
    } else

        // Redireciona para 'profile'.
        location.href = '/profile'
}
