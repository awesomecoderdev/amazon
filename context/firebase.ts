import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration //productislands-com
// const firebaseConfig = {
// 	apiKey: "AIzaSyB_C6pihLEr5F3kvZ4DIzEdBQKyHbfAXoo",
// 	authDomain: "productislands-com.firebaseapp.com",
// 	projectId: "productislands-com",
// 	storageBucket: "productislands-com.appspot.com",
// 	messagingSenderId: "369664479088",
// 	appId: "1:369664479088:web:77f9a26ea5689d47a5c9b5",
// 	measurementId: "G-RNX901RHHR",
// };

// Your web app's Firebase configuration // wpplagiarism
// const firebaseConfig = {
// 	apiKey: "AIzaSyDDL5dGUpE4LwI7tQqbtVivNaWfeijsC8A",
// 	authDomain: "wpplagiarism.firebaseapp.com",
// 	projectId: "wpplagiarism",
// 	storageBucket: "wpplagiarism.appspot.com",
// 	messagingSenderId: "181081001165",
// 	appId: "1:181081001165:web:1410933c5d597f002aad84",
// 	measurementId: "G-TLVYNSQM6C",
// };

// Your web app's Firebase configuration //plagiarismwp
// const firebaseConfig = {
// 	apiKey: "AIzaSyBlInT9nvh7aLQtC4_W2fvuus0cXPKfr-w",
// 	authDomain: "plagiarismwp.firebaseapp.com",
// 	projectId: "plagiarismwp",
// 	storageBucket: "plagiarismwp.appspot.com",
// 	messagingSenderId: "874877486286",
// 	appId: "1:874877486286:web:9e67b55e94b996fbdf3c9f",
// 	measurementId: "G-DZTVKMJDH2",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const firebase = getAuth(app);
