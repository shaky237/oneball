import AdminGuard from "@/components/AdminGuard";
import PredictionManager from "@/components/PredictionManager";
import Link from "next/link";

export default function AdminPage() {
  return (
    <AdminGuard>
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h1 style={{ color: "#00ff88", fontSize: "24px", margin: 0 }}>
              ONEBALL Admin
            </h1>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/admin/approval"
                style={{
                  padding: "10px 20px",
                  background: "#1e293b",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  border: "1px solid #334155",
                  fontWeight: "bold",
                }}
              >
                💳 Payment Approvals →
              </Link>
              <Link
                href="/admin/vip-content"
                style={{
                  padding: "10px 20px",
                  background: "#1e293b",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  border: "1px solid #334155",
                  fontWeight: "bold",
                }}
              >
                🖼️ VIP Content →
              </Link>
            </div>
          </div>
        </div>

        <PredictionManager />
      </div>
    </AdminGuard>
  );
}
