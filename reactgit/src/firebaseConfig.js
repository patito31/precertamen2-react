// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcf8zoW68z_zlqUPEyP_qWG3BhfOtVX7s",
  authDomain: "precertamen2-react.firebaseapp.com",
  projectId: "precertamen2-react",
  storageBucket: "precertamen2-react.firebasestorage.app",
  messagingSenderId: "759750783420",
  appId: "1:759750783420:web:2bb5d0e784432ebba27bb9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);