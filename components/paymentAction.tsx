"use client";

export default function PaymentActions({
  id,
}: {
  id: string;
}) {
  async function updateStatus(
    status: string
  ) {
    await fetch(
      "/api/update-payment",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      }
    );

    location.reload();
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <button
        onClick={() =>
          updateStatus("approved")
        }
        style={{
          background: "green",
          color: "white",
          padding: "8px 15px",
          border: "none",
          borderRadius: "5px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        Approve
      </button>

      <button
        onClick={() =>
          updateStatus("rejected")
        }
        style={{
          background: "red",
          color: "white",
          padding: "8px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Reject
      </button>
    </div>
  );
}