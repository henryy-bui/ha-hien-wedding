import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import Lightbox from './Lightbox'
import './Gallery.css'

const PHOTOS = [
  { bg: 'linear-gradient(135deg, #F5D5CF 0%, #E8A598 100%)', label: 'Khoảnh khắc 1' },
  { bg: 'linear-gradient(135deg, #E8D5B0 0%, #C9A96E 100%)', label: 'Khoảnh khắc 2' },
  { bg: 'linear-gradient(135deg, #FBE8D8 0%, #F5D5CF 100%)', label: 'Khoảnh khắc 3' },
  { bg: 'linear-gradient(135deg, #C9A96E 0%, #E8A598 100%)', label: 'Khoảnh khắc 4' },
  { bg: 'linear-gradient(135deg, #F5D5CF 0%, #FBE8D8 100%)', label: 'Khoảnh khắc 5' },
  { bg: 'linear-gradient(135deg, #E8A598 0%, #C9A96E 100%)', label: 'Khoảnh khắc 6' },
]

export default function Gallery() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = () => setOpenIndex(null)
  const prev = () =>
    setOpenIndex((i) => (i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length))
  const next = () =>
    setOpenIndex((i) => (i === null ? i : (i + 1) % PHOTOS.length))

  return (
    <section className="gallery-bg" ref={sectionRef} id="gallery" data-wipe="up">
      <div className="section" style={{ textAlign: 'center' }}>
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
              className={`gallery-item reveal reveal-delay-${(i % 3) + 1} reveal-blur`}
              style={{ background: p.bg }}
              aria-label={`Mở ảnh: ${p.label}`}
              onClick={() => setOpenIndex(i)}
            >
              <div className="gallery-overlay">
                <span className="gallery-heart">♥</span>
              </div>
            </button>
          ))}
        </div>

        <p className="gallery-note reveal reveal-delay-2">
          Ảnh thật sẽ được cập nhật sau buổi chụp pre-wedding 📸
        </p>
      </div>

      <Lightbox
        photos={PHOTOS}
        index={openIndex}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
