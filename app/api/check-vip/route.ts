import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export async function POST(
  request: Request
) {
  try {
    const { phoneNumber } =
      await request.json();

    const querySnapshot =
      await getDocs(
        collection(db, "payments")
      );

    const payment =
      querySnapshot.docs.find(
        (doc) => {
          const data = doc.data();

          return (
            data.phoneNumber ===
              phoneNumber &&
            data.status ===
              "approved"
          );
        }
      );
    return NextResponse.json({
      approved: !!payment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        approved: false,
      },
      { status: 500 }
    );
  }
}