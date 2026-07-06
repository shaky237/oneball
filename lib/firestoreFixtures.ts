import { app } from "./firebase";
// Reads use the REST-based "lite" Firestore build instead of the default one.
// The default build resolves to a gRPC transport under Node/SSR, which can fail
// DNS resolution via a background channel outside this function's try/catch and
// crash the process. The lite build uses plain fetch, so failures always surface
// as a normal rejected promise here.
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";

export type StoredPrediction = {
  homePercent: string;
  drawPercent: string;
  awayPercent: string;
  advice: string;
};

export type PredictionsResult = {
  predictions: Map<string, StoredPrediction>;
  firestoreAvailable: boolean;
};

const FIRESTORE_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Firestore request timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function getAllPredictions(): Promise<PredictionsResult> {
  try {
    const liteDb = getFirestore(app);
    const snapshot = await withTimeout(
      getDocs(collection(liteDb, "predictions")),
      FIRESTORE_TIMEOUT_MS
    );
    const map = new Map<string, StoredPrediction>();
    snapshot.forEach((docSnap) => {
      map.set(docSnap.id, docSnap.data() as StoredPrediction);
    });
    return { predictions: map, firestoreAvailable: true };
  } catch (error) {
    console.error("Firestore unavailable, falling back to empty predictions:", error);
    return { predictions: new Map(), firestoreAvailable: false };
  }
}
