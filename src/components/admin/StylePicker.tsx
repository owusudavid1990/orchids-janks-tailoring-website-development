"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, ImagePlus, Loader2, Plus, PoundSterling, X } from "lucide-react";
import type { StyleCategory } from "@/config/measurement-profile";
import { resizeImageFile } from "@/lib/resize-image";
import type { ProfilePhoto } from "@/components/admin/PhotoUploader";

interface Props {
  category: StyleCategory;
  selected?: string; // option code
  onChange: (code: string) => void;
  /** Garment name shown in front of the category label when captioning an uploaded reference photo. */
  contextLabel?: string;
  /** All photos already on this client's profile — used only to count how many exist for a given option. */
  photos?: ProfilePhoto[];
  /** Uploads a reference photo to the client's Photos tab. Required for the "+" control to appear. */
  onUploadReference?: (dataUrl: string, caption: string) => Promise<void>;
}

/**
 * One style category rendered as a row of clickable option cards — the
 * "interactive" picker, replacing what was a plain dropdown on the source
 * spreadsheet. Each card shows its letter code (matching the paper form
 * a client may already be familiar with), the option's label, and small
 * icons where the option needs a reference photo or carries an extra charge.
 */
export function StylePicker({ category, selected, onChange, contextLabel, photos, onUploadReference }: Props) {
  // Full-size preview on click — the picker thumbnail is small (44px), and
  // these are line-art diagrams where detail (which side the piping runs,
  // how many pleats) genuinely matters at a fitting.
  const [zoomed, setZoomed] = useState<{ src: string; label: string } | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingCode = useRef<string | null>(null);

  const captionFor = (opt: { label: string }) =>
    `${contextLabel ? `${contextLabel} – ` : ""}${category.label}: ${opt.label}`;

  const referenceCount = (opt: { label: string }) =>
    photos?.filter((p) => p.caption === captionFor(opt)).length ?? 0;

  const openPickerFor = (code: string) => {
    pendingCode.current = code;
    fileInputRef.current?.click();
  };

  const handleFiles = async (files: FileList | null) => {
    const code = pendingCode.current;
    const opt = category.options.find((o) => o.code === code);
    if (!files || files.length === 0 || !opt || !onUploadReference) return;
    setUploadError(null);
    setUploadingFor(code);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await resizeImageFile(file);
        await onUploadReference(dataUrl, captionFor(opt));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingFor(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="block text-[11px] tracking-[0.12em] uppercase text-white/40 mb-2.5">
        {category.label}
      </span>
      <div className="flex flex-wrap gap-2">
        {category.options.map((opt) => {
          const isSelected = selected === opt.code;
          const refCount = opt.needsReference ? referenceCount(opt) : 0;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => onChange(opt.code)}
              title={opt.label}
              className={`group relative flex items-center gap-2 pl-2 pr-3.5 py-2 border text-left transition-all duration-150 ${
                isSelected
                  ? "border-gold bg-gold/10 text-white"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white/85"
              }`}
            >
              {opt.image ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setZoomed({ src: opt.image!, label: opt.label }); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setZoomed({ src: opt.image!, label: opt.label }); } }}
                  className="shrink-0 relative w-11 h-11 bg-white rounded-sm overflow-hidden border border-black/10 cursor-zoom-in"
                  aria-label={`View larger reference image for ${opt.label}`}
                >
                  <Image src={opt.image} alt={opt.label} fill sizes="44px" className="object-contain p-0.5" />
                </span>
              ) : (
                <span
                  className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                    isSelected ? "bg-gold text-black" : "bg-white/10 text-white/50 group-hover:bg-white/15"
                  }`}
                >
                  {isSelected ? <Check size={11} /> : opt.code}
                </span>
              )}
              <span className="text-[12px] leading-snug max-w-[220px]">{opt.label}</span>
              {opt.image && isSelected && (
                <Check size={13} className="shrink-0 text-gold" aria-label="Selected" />
              )}
              {opt.needsReference && isSelected && onUploadReference && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); openPickerFor(opt.code); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openPickerFor(opt.code); } }}
                  title={refCount > 0 ? `${refCount} reference photo${refCount === 1 ? "" : "s"} attached — add more` : "Attach a reference photo"}
                  aria-label="Attach a reference photo"
                  className="shrink-0 flex items-center gap-1 rounded-full bg-white/10 hover:bg-gold hover:text-black text-white/70 pl-1 pr-1.5 py-0.5 transition-colors"
                >
                  {uploadingFor === opt.code ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                  {refCount > 0 && <span className="text-[10px] leading-none">{refCount}</span>}
                </span>
              )}
              {opt.needsReference && !(isSelected && onUploadReference) && (
                <ImagePlus size={11} className="shrink-0 text-white/30" aria-label="Needs a reference photo" />
              )}
              {opt.extraCharge && (
                <PoundSterling size={11} className="shrink-0 text-gold/70" aria-label="Extra charge" />
              )}
            </button>
          );
        })}
      </div>

      {onUploadReference && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      )}

      {uploadError && (
        <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5">
          <X size={12} /> {uploadError}
        </p>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomed(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-8 cursor-zoom-out"
        >
          <div className="relative max-w-sm w-full bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomed(null)}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
            >
              <X size={15} />
            </button>
            <div className="relative aspect-square">
              <Image src={zoomed.src} alt={zoomed.label} fill sizes="384px" className="object-contain" />
            </div>
            <p className="text-center text-charcoal text-sm mt-3">{zoomed.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
