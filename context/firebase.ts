import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyB_C6pihLEr5F3kvZ4DIzEdBQKyHbfAXoo",
	authDomain: "productislands-com.firebaseapp.com",
	projectId: "productislands-com",
	storageBucket: "productislands-com.appspot.com",
	messagingSenderId: "369664479088",
	appId: "1:369664479088:web:77f9a26ea5689d47a5c9b5",
	measurementId: "G-RNX901RHHR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firebase = getAuth(app);
