import AdminGuard from "@/components/AdminGuard";
import PaymentActions from "@/components/paymentAction";
import Link from "next/link";
import { getAdminPayments } from "@/lib/firestorePayments";

export default async function AdminPage() {
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
        <h1>ONEBALL Admin Dashboard</h1>

        <Link
          href="/admin/predictions"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 24px",
            background: "#00ff88",
            color: "black",
            fontWeight: "bold",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          ⚽ Manage Predictions
        </Link>

        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#1e293b",
            borderRadius: "10px",
          }}
        >
          <h2>Total Payments</h2>
          <p style={{ fontSize: "30px" }}>
            {payments.length}
          </p>
        </div>

        <h2 style={{ marginTop: "30px" }}>
          Payment Submissions
        </h2>

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
                paddingBottom: "15px",
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
                <strong>Payment Method:</strong>{" "}
                {payment.paymentMethod}
              </p>

              <p>
                <strong>
                  Phone Number / Transaction ID:
                </strong>{" "}
                {payment.paymentInfo}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {payment.status}
              </p>

              <p>
                <strong>Submitted:</strong>{" "}
                {payment.createdAt?.seconds
                  ? new Date(
                      payment.createdAt.seconds * 1000
                    ).toLocaleString()
                  : "Loading..."}
              </p>

              <PaymentActions id={payment.id} />
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}