"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getVipContentItem,
  saveVipContentItem,
  deleteVipContentItem,
  VipContentDocId,
} from "@/lib/firestoreVipContent";

type Props = {
  docId: VipContentDocId;
  storageFolder: string;
  title: string;
  accentColor: string;
};

export default function VipContentUploader({
  docId,
  storageFolder,
  title,
  accentColor,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const item = await getVipContentItem(docId);
      if (cancelled) return;
      setImageUrl(item?.imageUrl ?? null);
      setStoragePath(item?.storagePath ?? null);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [docId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const path = `${storageFolder}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await saveVipContentItem(docId, url, path);

      const previousPath = storagePath;
      if (previousPath && previousPath !== path) {
        try {
          await deleteObject(ref(storage, previousPath));
        } catch (cleanupError) {
          console.error("Failed to remove previous VIP image:", cleanupError);
        }
      }

      setImageUrl(url);
      setStoragePath(path);
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to upload VIP content image:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!storagePath) return;
    setSaving(true);
    setError(null);
    try {
      await deleteObject(ref(storage, storagePath));
      await deleteVipContentItem(docId);
      setImageUrl(null);
      setStoragePath(null);
    } catch (err) {
      console.error("Failed to delete VIP content image:", err);
      setError("Delete failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        background: "#1e293b",
        border: `1px solid ${accentColor}`,
        borderRadius: "14px",
        padding: "20px",
        flex: "1 1 320px",
        minWidth: "280px",
      }}
    >
      <h2 style={{ color: accentColor, fontSize: "18px", marginTop: 0 }}>
        {title}
      </h2>

      <div
        style={{
          background: "#0f172a",
          borderRadius: "10px",
          padding: "12px",
          marginBottom: "16px",
          minHeight: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={`${title} preview`}
            style={{
              maxWidth: "100%",
              maxHeight: "260px",
              borderRadius: "10px",
              display: "block",
            }}
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: "100%",
              maxHeight: "260px",
              borderRadius: "10px",
              display: "block",
            }}
          />
        ) : (
          <p style={{ color: "#94a3b8" }}>No VIP image uploaded yet.</p>
        )}
      </div>

      {error && (
        <p style={{ color: "#f87171", fontSize: "14px", marginTop: "-8px" }}>
          {error}
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ color: "white", marginBottom: "12px", width: "100%" }}
      />

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={handleSave}
          disabled={!file || saving}
          style={{
            padding: "10px 18px",
            background: accentColor,
            color: "#0f172a",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: !file || saving ? "not-allowed" : "pointer",
            opacity: !file || saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : imageUrl ? "Replace" : "Save"}
        </button>

        {imageUrl && (
          <button
            onClick={handleDelete}
            disabled={saving}
            style={{
              padding: "10px 18px",
              background: "transparent",
              color: "#f87171",
              border: "1px solid #f87171",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
