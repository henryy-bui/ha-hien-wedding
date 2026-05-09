import { useScrollReveal } from '../hooks/useScrollReveal'
import './HumorSection.css'

const RULES = [
  {
    emoji: '😢',
    rule: 'Không được khóc to hơn cô dâu',
    note: 'Nếu không cầm được nước mắt, vui lòng chuẩn bị khăn tay riêng nhé!',
  },
  {
    emoji: '🍽️',
    rule: 'Vui lòng ăn no — bếp trưởng đã cố hết sức',
    note: 'Cô dâu chú rể rất muốn nghe nhận xét tích cực về từng món ăn.',
  },
  {
    emoji: '👗',
    rule: 'Outfit đẹp hơn cô dâu = bị mời ra ngoài',
    note: 'Mặc đẹp thoải mái, nhưng nhớ để chủ nhân tỏa sáng là trên hết!',
  },
  {
    emoji: '📷',
    rule: 'Chụp ảnh thả ga — nhưng đừng quên tận hưởng',
    note: 'Sống trong khoảnh khắc còn đẹp hơn là chỉ đăng story lên MXH.',
  },
  {
    emoji: '🎉',
    rule: 'Cổ vũ nhiệt tình khi chú rể rước dâu',
    note: 'Anh ấy cần mọi nguồn động viên có thể có được. Tin tôi đi.',
  },
  {
    emoji: '🥂',
    rule: 'Nâng ly khi được mời — hoặc khi quá vui',
    note: 'Mọi khoảnh khắc đẹp đều xứng đáng được ăn mừng đúng cách.',
  },
]

export default function HumorSection() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section className="humor-bg" ref={sectionRef} id="notes">
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="reveal">
          <span className="section-label">Lưu Ý Quan Trọng</span>
          <h2 className="section-title">Quy Tắc Vàng Của Đám Cưới</h2>
          <p className="humor-sub reveal reveal-delay-1">
            (Đọc kỹ trước khi đến — không test thử nhé 😄)
          </p>
          <div className="section-divider" style={{ marginTop: '16px' }} />
        </div>

        <div className="humor-grid">
          {RULES.map((r, i) => (
            <div key={r.rule} className={`humor-card reveal reveal-delay-${(i % 3) + 1}`}>
              <span className="humor-emoji">{r.emoji}</span>
              <h3 className="humor-rule">{r.rule}</h3>
              <p className="humor-note">{r.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
