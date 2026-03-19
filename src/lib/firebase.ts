import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCVDQv9q47kIAxg1qRw-4i-mEwcG66Dhlg",
  authDomain: "collecthub2-1fb0e.firebaseapp.com",
  projectId: "collecthub2-1fb0e",
  storageBucket: "collecthub2-1fb0e.firebasestorage.app",
  messagingSenderId: "587099974853",
  appId: "1:587099974853:web:3a161d999a63a9398c14ac",
  measurementId: "G-W8194PCL3C"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
