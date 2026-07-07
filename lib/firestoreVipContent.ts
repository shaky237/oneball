import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export type VipContentDocId = "premiumGames" | "correctScore";

export type VipContentItem = {
  imageUrl: string;
  storagePath: string;
  updatedAt?: unknown;
};

export async function getVipContentItem(
  docId: VipContentDocId
): Promise<VipContentItem | null> {
  try {
    const snap = await getDoc(doc(db, "vipContent", docId));
    if (!snap.exists()) return null;
    return snap.data() as VipContentItem;
  } catch (error) {
    console.error(`Failed to fetch vipContent/${docId} from Firestore:`, error);
    return null;
  }
}

export async function saveVipContentItem(
  docId: VipContentDocId,
  imageUrl: string,
  storagePath: string
): Promise<void> {
  await setDoc(doc(db, "vipContent", docId), {
    imageUrl,
    storagePath,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteVipContentItem(docId: VipContentDocId): Promise<void> {
  await deleteDoc(doc(db, "vipContent", docId));
}
