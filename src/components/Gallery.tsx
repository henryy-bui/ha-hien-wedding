import { useEffect, useRef, useState } from "react";
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
    bg: "/images/optimized/akkha02464.jpg",
    label: "Khoảnh khắc 3",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02048.jpg",
    label: "Khoảnh khắc 4",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02460.jpg",
    label: "Khoảnh khắc 5",
    aspectRatio: "2 / 3",
  },
  {
    bg: "/images/optimized/akkha02516.jpg",
    label: "Khoảnh khắc 6",
    aspectRatio: "2 / 3",
  },
];

export default function Gallery() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Track which slide is centered in the mobile carousel. On desktop the
  // grid isn't a scroll container, so the observer never updates state and
  // the pager stays hidden via CSS — no special-casing needed.
  useEffect(() => {
    const container = slideRef.current;
    if (!container) return;
    const items = itemRefs.current.filter((x): x is HTMLButtonElement => !!x);
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestRatio = 0;
        let bestIdx = -1;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = items.indexOf(entry.target as HTMLButtonElement);
          }
        });
        if (bestIdx >= 0 && bestRatio >= 0.6) {
          setActiveIndex(bestIdx);
        }
      },
      { root: container, threshold: [0.4, 0.6, 0.8, 1] }
    );

    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (i: number) => {
    itemRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

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

        <div className="gallery-grid" ref={slideRef}>
          {PHOTOS.map((p, i) => (
            <button
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              className={`gallery-item reveal reveal-delay-${
                (i % 3) + 1
              } reveal-blur${activeIndex === i ? " is-active" : ""}`}
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
              <span className="gallery-frame" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="gallery-pager">
          <div
            className="gallery-dots"
            role="tablist"
            aria-label="Điều hướng ảnh"
          >
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={activeIndex === i}
                aria-label={`Đi đến ảnh ${i + 1}`}
                className={`gallery-dot${
                  activeIndex === i ? " is-active" : ""
                }`}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
          <span className="gallery-counter" aria-hidden="true">
            <span className="gallery-counter-num">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="gallery-counter-sep">/</span>
            <span className="gallery-counter-total">
              {String(PHOTOS.length).padStart(2, "0")}
            </span>
          </span>
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
