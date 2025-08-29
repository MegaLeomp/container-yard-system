import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvDg1-qqhUF3EYzZ492ncTHBUr2blJeBo",
  authDomain: "patio-conteiner.firebaseapp.com",
  projectId: "patio-conteiner",
  storageBucket: "patio-conteiner.firebasestorage.app",
  messagingSenderId: "962825786298",
  appId: "1:962825786298:web:2b98cdac0fc5a7545a4383",
  measurementId: "G-TX5CZH576C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);