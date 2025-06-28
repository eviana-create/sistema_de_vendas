// js/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAyA71yXadrO51_jFtjj4rt6Kd8CPf9thg",
  authDomain: "sistema-de-vendas-93c23.firebaseapp.com",
  projectId: "sistema-de-vendas-93c23",
  storageBucket: "sistema-de-vendas-93c23.firebasestorage.app",
  messagingSenderId: "819449830074",
  appId: "1:819449830074:web:230ce9308742da5d598083"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
