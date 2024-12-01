import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCxyUrHAhsA6l8Uv6UzQkGOMJ3FQlvBi4k",
    authDomain: "lab-3995f.firebaseapp.com",
    projectId: "lab-3995f",
    storageBucket: "lab-3995f.firebasestorage.app",
    messagingSenderId: "1049873084719",
    appId: "1:1049873084719:web:c06a0838e6ce69f74b71da",
    measurementId: "G-RRCF3LRFCJ"
  };

  const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);

export { auth, firestore };