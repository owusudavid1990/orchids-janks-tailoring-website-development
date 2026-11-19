"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { resizeImageFile } from "@/lib/resize-image";

export interface ProfilePhoto {
  id: string;
  url: string | null;
  caption: string | null;
}

interface Props {
  photos: ProfilePhoto[];
  onUpload: (dataUrl: string, caption: string) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
}

export function PhotoUploader({ photos, onUpload, onDelete }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await resizeImageFile(file);
        await onUpload(dataUrl, file.name.replace(/\.[^.]+$/, ""));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        {photos.map((p) => (
          <div key={p.id} className="group relative aspect-square bg-white/5 border border-white/10 overflow-hidden">
            {p.url ? (
              <Image src={p.url} alt={p.caption ?? "Reference photo"} fill sizes="200px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">
                Unavailable
              </div>
            )}
            <button
              type="button"
              onClick={() => onDelete(p.id)}
              aria-label="Delete photo"
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white/80 hover:bg-red-500/80 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-square border border-dashed border-white/15 hover:border-gold/50 flex flex-col items-center justify-center gap-1.5 text-white/40 hover:text-gold transition-colors disabled:opacity-50"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          <span className="text-[10px] tracking-[0.1em] uppercase">{busy ? "Uploading" : "Add photo"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && (
        <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  );
}
