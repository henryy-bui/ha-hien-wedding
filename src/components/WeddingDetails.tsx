import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './WeddingDetails.css'

const DETAILS = [
  {
    icon: '📅',
    label: 'Ngày & Giờ',
    title: '31.05.2026',
    lines: ['Chủ Nhật', 'Lễ thành hôn: 10:00 sáng', 'Tiệc mừng: 11:30 sáng'],
  },
  {
    icon: '📍',
    label: 'Địa Điểm',
    title: 'Trung Tâm Tiệc Cưới Hoàng Gia',
    lines: ['123 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Sảnh: Vàng — Tầng 3'],
  },
  {
    icon: '👗',
    label: 'Dress Code',
    title: 'Thanh Lịch & Tươi Sáng',
    lines: ['Formal hoặc Semi-formal', 'Gợi ý: Trắng, Kem, Pastel', 'Hãy tỏa sáng theo cách của bạn ✨'],
  },
]

export default function WeddingDetails() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return

    const grid = gridRef.current
    if (!grid) return

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.detail-card'))
    const cleanups: Array<() => void> = []

    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 18
        const y = ((e.clientY - r.top)  / r.height - 0.5) * -14
        card.style.transition = 'box-shadow 0.3s ease'
        card.style.transform  = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px) scale(1.01)`
      }

      const onLeave = () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease'
        card.style.transform  = ''
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section className="details-bg" ref={sectionRef} id="details" data-wipe="left">
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="reveal">
          <span className="section-label">Thông Tin Đám Cưới</span>
          <h2 className="section-title">Chi Tiết Buổi Lễ</h2>
          <div className="section-divider" />
        </div>

        <div className="details-grid" ref={gridRef}>
          {DETAILS.map((d, i) => (
            <div key={d.label} className={`detail-card reveal reveal-delay-${i + 1} reveal-zoom`}>
              <span className="detail-icon">{d.icon}</span>
              <span className="detail-label">{d.label}</span>
              <h3 className="detail-title">{d.title}</h3>
              <div className="detail-rule" />
              {d.lines.map((line) => (
                <p key={line} className="detail-line">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
