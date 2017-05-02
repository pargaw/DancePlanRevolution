// Initialize Firebase
var config = {
    apiKey: "AIzaSyB4LJ5wNEafW7IntL13fcE3OzlxwYRWwXo",
    authDomain: "danceplanrevolution.firebaseapp.com",
    databaseURL: "https://danceplanrevolution.firebaseio.com",
    projectId: "danceplanrevolution",
    storageBucket: "danceplanrevolution.appspot.com",
    messagingSenderId: "1066153127830"
};

var danceApp = firebase.initializeApp(config);
console.log(danceApp.name);  // "[DEFAULT]" sanity check

var danceStorage = danceApp.storage();
var danceDatabase = danceApp.database();