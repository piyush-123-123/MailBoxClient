import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyASS1_MljLswfplnLoSXH8U5fEAJeHFUp8",
  authDomain: "mailboxclient-9e998.firebaseapp.com",
  projectId: "mailboxclient-9e998",
  storageBucket: "mailboxclient-9e998.firebasestorage.app",
  messagingSenderId: "268613172017",
  appId: "1:268613172017:web:b7ef9ff7b1e83060dd0e10"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);