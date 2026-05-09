import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Lightbox.css";

export interface LightboxPhoto {
  bg: string;
  label: string;
}

interface Props {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  // Keyboard: Esc closes, arrows navigate. Listener attached only while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  // Lock body scroll while the lightbox is open. Restore the previous value
  // on close so we don't clobber a different overflow set elsewhere.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus to the close button when the lightbox opens (basic a11y).
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  if (!open) return null;
  const photo = photos[index];
  if (!photo) return null;

  // Portal to body so the modal escapes any ancestor clip-path / transform /
  // filter (the Gallery section uses data-wipe="up" → clip-path, which would
  // otherwise trim our fixed-position overlay to the section's bounding box
  // and let other fixed UI like NavDots / AudioPlayer paint on top).
  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.label}
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        type="button"
        className="lightbox-close"
        aria-label="Đóng"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>

      <button
        type="button"
        className="lightbox-nav lightbox-prev"
        aria-label="Ảnh trước"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        ‹
      </button>

      <div
        className="lightbox-figure"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="lightbox-image"
          style={{ background: photo.bg }}
          role="img"
          aria-label={photo.label}
        />
        <div className="lightbox-caption">
          <span className="lightbox-label">{photo.label}</span>
          <span className="lightbox-counter">
            {index + 1} / {photos.length}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="lightbox-nav lightbox-next"
        aria-label="Ảnh tiếp theo"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        ›
      </button>
    </div>,
    document.body
  );
}
