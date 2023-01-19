// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU-DKEU8Kp017zf4VCDM-mSmlMm2Yu_p4",
  authDomain: "albamart-9de65.firebaseapp.com",
  projectId: "albamart-9de65",
  storageBucket: "albamart-9de65.appspot.com",
  messagingSenderId: "494161431026",
  appId: "1:494161431026:web:c06410285781ac56a4436b",
  measurementId: "G-RJC12X7T5Z"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);
// export default storage;
export const db = getFirestore(app);
export const storage = getStorage(app);

