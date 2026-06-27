import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export type StoredPrediction = {
  homePercent: string;
  drawPercent: string;
  awayPercent: string;
  advice: string;
};

export async function getAllPredictions(): Promise<Map<string, StoredPrediction>> {
  const snapshot = await getDocs(collection(db, "predictions"));
  const map = new Map<string, StoredPrediction>();
  snapshot.forEach((docSnap) => {
    map.set(docSnap.id, docSnap.data() as StoredPrediction);
  });
  return map;
}
