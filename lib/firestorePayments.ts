import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAdminPayments() {
  try {
    const [premiumSnapshot, correctScoreSnapshot] = await Promise.all([
      getDocs(collection(db, "payments")),
      getDocs(collection(db, "correctScorePayments")),
    ]);

    const premiumPayments = premiumSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: "Premium",
    }));

    const correctScorePayments = correctScoreSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      category: "Correct Score",
    }));

    return [...premiumPayments, ...correctScorePayments];
  } catch (error) {
    console.error("Failed to fetch admin payments from Firestore:", error);
    return [];
  }
}
