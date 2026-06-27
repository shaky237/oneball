export const dynamic = "force-dynamic";

import AdminGuard from "@/components/AdminGuard";
import PaymentActions from "@/components/paymentAction";
import Link from "next/link";
import { getAdminPayments } from "@/lib/firestorePayments";

export default async function ApprovalPage() {
  const payments = await getAdminPayments();

  return (
    <AdminGuard>
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
            <div>
              <Link
                href="/admin"
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: "8px",
                }}
              >
                ← Back to Admin
              </Link>
              <h1 style={{ color: "#00ff88", fontSize: "24px", margin: 0 }}>
                Payment Approvals
              </h1>
            </div>
            <div
              style={{
                padding: "16px 24px",
                background: "#1e293b",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                Total Submissions
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "white",
                  margin: 0,
                }}
              >
                {payments.length}
              </p>
            </div>
          </div>

          {payments.length === 0 ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#64748b",
                background: "#1e293b",
                borderRadius: "10px",
              }}
            >
              No payment submissions yet.
            </div>
          ) : (
            <div
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              {payments.map((payment: any) => (
                <div
                  key={payment.id}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #334155",
                    paddingBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      borderRadius: "20px",
                      marginBottom: "12px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor:
                        payment.plan === "VIP Correct Scores"
                          ? "#9333ea"
                          : "#16a34a",
                    }}
                  >
                    {payment.plan === "VIP Correct Scores"
                      ? "🟣 VIP Correct Score"
                      : "🟢 Premium Predictions"}
                  </div>

                  <p>
                    <strong>Payment Method:</strong> {payment.paymentMethod}
                  </p>

                  <p>
                    <strong>Phone Number / Transaction ID:</strong>{" "}
                    {payment.paymentInfo}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          payment.status === "approved"
                            ? "#22c55e"
                            : payment.status === "rejected"
                            ? "#ef4444"
                            : "#f59e0b",
                        fontWeight: "bold",
                      }}
                    >
                      {payment.status}
                    </span>
                  </p>

                  <p>
                    <strong>Submitted:</strong>{" "}
                    {payment.createdAt?.seconds
                      ? new Date(
                          payment.createdAt.seconds * 1000
                        ).toLocaleString()
                      : "—"}
                  </p>

                  <PaymentActions id={payment.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
