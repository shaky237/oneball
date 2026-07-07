"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVipContentItem } from "@/lib/firestoreVipContent";

export default function VIPGamesPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vipAccess = localStorage.getItem("vipAccess");

    if (vipAccess !== "true") {
      router.push("/vip/access");
    }

    const fetchContent = async () => {
      const item = await getVipContentItem("premiumGames");
      setImageUrl(item?.imageUrl ?? null);
      setLoading(false);
    };
    fetchContent();
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

        {loading ? (
          <p style={{ marginTop: "20px" }}>Loading...</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Premium Games VIP predictions"
            style={{
              maxWidth: "100%",
              width: "100%",
              borderRadius: "10px",
              marginTop: "20px",
              display: "block",
            }}
          />
        ) : (
          <p style={{ marginTop: "20px" }}>No VIP image uploaded yet.</p>
        )}
      </div>
    </div>
  );
}