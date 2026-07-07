"use client";

import { useEffect, useState } from "react";
import { getVipContentItem } from "@/lib/firestoreVipContent";

export default function CorrectScoreVIP() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const item = await getVipContentItem("correctScore");
      setImageUrl(item?.imageUrl ?? null);
      setLoading(false);
    }

    loadContent();
  }, []);

  return (
    <main className="main">
      <div className="vip-card">
        <h1 className="logo">VIP Correct Score</h1>

        {loading ? (
          <p style={{ color: "white" }}>Loading predictions...</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="VIP Correct Score predictions"
            style={{
              maxWidth: "100%",
              width: "100%",
              borderRadius: "10px",
              marginTop: "20px",
              display: "block",
            }}
          />
        ) : (
          <p style={{ color: "white" }}>No VIP image uploaded yet.</p>
        )}
      </div>
    </main>
  );
}
