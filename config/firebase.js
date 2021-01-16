import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyCLagOAMVkYnC5f31Jb5-zxVkgGKRxue9M",
    authDomain: "todo-app--js.firebaseapp.com",
    databaseURL: "https://todo-app--js.firebaseio.com",
    projectId: "todo-app--js",
    storageBucket: "todo-app--js.appspot.com",
    messagingSenderId: "1058278769750",
    appId: "1:1058278769750:web:c5caa7d9e6b621d7c967f7",
    measurementId: "G-45E6BN64EY"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);