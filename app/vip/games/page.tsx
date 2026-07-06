"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function VIPGamesPage() {
  const router = useRouter();
  const [games, setGames] = useState("");

 
 
useEffect(() => {
  const vipAccess = localStorage.getItem("vipAccess");

  if (vipAccess !== "true") {
    router.push("/vip/access");
  }

  const fetchGames = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "vipGames"));

      let allGames = "";

      querySnapshot.forEach((doc) => {
        allGames += doc.data().games + "\n\n";
      });

      setGames(allGames || "No prediction available yet — check back soon.");
    } catch (error) {
      console.error(error);
      setGames("No prediction available right now. Please try again shortly.");
    }
  };
  fetchGames();
}, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
      }}
    >
      <h1>ONEBALL VIP GAMES</h1>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >

        <h2>Today's VIP Predictions</h2>

<pre
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8",
    fontSize: "16px",
    marginTop: "20px",
  }}
>
  {games}
</pre>


      </div>
    </div>
  );
}