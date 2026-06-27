"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CorrectScoreVIP() {
  const [games, setGames] = useState("Loading predictions...");

  useEffect(() => {
    async function loadGames() {
      try {
        const docRef = doc(db, "correctScoreGames", "today");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGames(docSnap.data().games);
        } else {
          setGames("No predictions available.");
        }
      } catch (error) {
        console.error(error);
        setGames("Failed to load predictions.");
      }
    }

    loadGames();
  }, []);

  return (
    <main className="main">
      <div className="vip-card">
        <h1 className="logo">VIP Correct Score</h1>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            color: "white",
            fontSize: "16px",
            lineHeight: "1.8",
          }}
        >
          {games}
        </pre>
      </div>
    </main>
  );
}