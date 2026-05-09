import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Lightbox, { type LightboxPhoto } from "./Lightbox";
import "./Gallery.css";

// `bg` is a URL path; both Gallery and Lightbox wrap it in url(...) at
// render time. Optimized assets are produced by `yarn optimize:images`
// (see scripts/optimize-images.mjs) — names are lowercased + sanitized.
const PHOTOS: LightboxPhoto[] = [
  {
    bg: "/images/optimized/akkha02140.jpg",
    label: "Khoảnh khắc 1",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02382.jpg",
    label: "Khoảnh khắc 2",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02460.jpg",
    label: "Khoảnh khắc 3",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02516.jpg",
    label: "Khoảnh khắc 4",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02048.jpg",
    label: "Khoảnh khắc 5",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02464.jpg",
    label: "Khoảnh khắc 6",
    aspectRatio: "2 / 3",
  },
];

export default function Gallery() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) =>
      i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length
    );
  const next = () =>
    setOpenIndex((i) => (i === null ? i : (i + 1) % PHOTOS.length));

  return (
    <section
      className="gallery-bg"
      ref={sectionRef}
      id="gallery"
      data-wipe="up"
    >
      <div className="section" style={{ textAlign: "center" }}>
        <div className="reveal">
          <span className="section-label">Khoảnh Khắc</span>
          <h2 className="section-title">Cùng Nhau Lưu Giữ</h2>
          <div className="section-divider" />
        </div>

        <div className="gallery-grid">
          {PHOTOS.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-item reveal reveal-delay-${
                (i % 3) + 1
              } reveal-blur`}
              style={{
                backgroundImage: `url("${p.bg}")`,
                aspectRatio: p.aspectRatio,
              }}
              aria-label={`Mở ảnh: ${p.label}`}
              onClick={() => setOpenIndex(i)}
            >
              <div className="gallery-overlay">
                <span className="gallery-heart">♥</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        photos={PHOTOS}
        index={openIndex}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}
