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

  return (
    <section className="details-bg" ref={sectionRef} id="details">
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="reveal">
          <span className="section-label">Thông Tin Đám Cưới</span>
          <h2 className="section-title">Chi Tiết Buổi Lễ</h2>
          <div className="section-divider" />
        </div>

        <div className="details-grid">
          {DETAILS.map((d, i) => (
            <div key={d.label} className={`detail-card reveal reveal-delay-${i + 1}`}>
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
