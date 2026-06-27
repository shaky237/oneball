import AdminGuard from "@/components/AdminGuard";
import PredictionManager from "@/components/PredictionManager";
import Link from "next/link";

export default function AdminPredictionsPage() {
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
          <Link
            href="/admin"
            style={{
              color: "#64748b",
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            ← Back to Admin
          </Link>
        </div>

        <PredictionManager />
      </div>
    </AdminGuard>
  );
}
