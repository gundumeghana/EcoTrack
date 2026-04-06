import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDezlC7L1q42iU2kAgs0Ews5VcbtMmYzwI",
  authDomain: "ecotrack-mg.firebaseapp.com",
  projectId: "ecotrack-mg",
  storageBucket: "ecotrack-mg.firebasestorage.app",
  messagingSenderId: "747749735371",
  appId: "1:747749735371:web:6c814fb719efcea7fed44e",
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore DB
export const db = getFirestore(app);

import { collection, addDoc } from "firebase/firestore";

export const seedAllData = async () => {

  // ✅ complaints
  const complaints = [
    { area: "Gachibowli", description: "Waste not collected", status: "Pending", date: "2026-04-06" },
    { area: "Madhapur", description: "Garbage overflow", status: "Pending", date: "2026-04-06" },
    { area: "Kondapur", description: "Plastic near lake", status: "Resolved", date: "2026-04-05" }
  ];

  // ✅ recycling centers
  const centers = [
    { name: "Green Earth Recycling Center", location: "Gachibowli" },
    { name: "EcoLife Processing Facility", location: "Madhapur" },
    { name: "Clean Future Recycling", location: "Kondapur" }
  ];

  // 🔥 insert complaints
  for (let c of complaints) {
    await addDoc(collection(db, "complaints"), c);
  }

  // 🔥 insert centers
  for (let c of centers) {
    await addDoc(collection(db, "recyclingCenters"), c);
  }

  console.log("Data added automatically");
};