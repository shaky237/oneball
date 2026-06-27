import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paymentData = {
      paymentInfo: body.transactionId,
      plan: body.plan,
      paymentMethod: body.paymentMethod,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    let docRef;

    if (body.plan === "Premium Predictions") {
      docRef = await addDoc(
        collection(db, "payments"),
        paymentData
      );
    } else if (body.plan === "VIP Correct Scores") {
      docRef = await addDoc(
        collection(db, "correctScorePayments"),
        paymentData
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid plan selected.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error("PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}