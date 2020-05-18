import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';



var firebaseConfig = {
    apiKey: "AIzaSyB49ShnUjMqfNtDBWZM6Dxryf4dIBnMW3Y",
    authDomain: "employee-adder-9f4e5.firebaseapp.com",
    databaseURL: "https://employee-adder-9f4e5.firebaseio.com",
    projectId: "employee-adder-9f4e5",
    storageBucket: "employee-adder-9f4e5.appspot.com",
    messagingSenderId: "709743977872",
    appId: "1:709743977872:web:f4862b7f63b850d168bf15",
    measurementId: "G-84LF7XN75Z"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
  
  export default firebase;