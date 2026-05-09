import { useScrollReveal } from '../hooks/useScrollReveal'
import './OurStory.css'

const MILESTONES = [
  {
    year: '2020',
    emoji: '💫',
    title: 'Lần Đầu Gặp Gỡ',
    desc: 'Một buổi chiều tình cờ, một nụ cười không thể quên. Chúng mình gặp nhau tại một sự kiện nhỏ và chẳng ai ngờ rằng khoảnh khắc đó lại thay đổi tất cả.',
  },
  {
    year: '2021',
    emoji: '🌊',
    title: 'Chuyến Đi Đầu Tiên',
    desc: 'Đà Nẵng — nơi chúng mình cùng ngắm hoàng hôn trên bờ biển và lần đầu biết rằng đây là điều gì đó thật sự đặc biệt.',
  },
  {
    year: '2025',
    emoji: '💍',
    title: 'Lời Cầu Hôn',
    desc: 'Dưới ánh hoàng hôn rực rỡ, anh quỳ xuống với bông hoa và câu hỏi khiến tim em ngừng đập một nhịp. Em đã gật đầu, và thế giới chúng mình thay đổi mãi mãi.',
  },
  {
    year: '2026',
    emoji: '🎊',
    title: 'Ngày Trọng Đại',
    desc: '31 tháng 05 năm 2026 — ngày chúng mình chính thức trở thành một gia đình. Và đây là lời mời trân trọng nhất dành cho những người yêu thương của chúng mình.',
  },
]

export default function OurStory() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section className="our-story-bg" ref={sectionRef} id="our-story">
      <div className="section">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="section-label">Câu Chuyện Của Chúng Mình</span>
          <h2 className="section-title">Hành Trình Tình Yêu</h2>
          <div className="section-divider" />
        </div>

        <div className="timeline">
          {MILESTONES.map((m, i) => (
            <div
              key={m.year}
              className={`timeline-item reveal reveal-delay-${i + 1} ${i % 2 === 0 ? 'tl-left' : 'tl-right'}`}
            >
              <div className="timeline-card">
                <span className="tl-emoji">{m.emoji}</span>
                <span className="tl-year">{m.year}</span>
                <h3 className="tl-title">{m.title}</h3>
                <p className="tl-desc">{m.desc}</p>
              </div>
              <div className="timeline-dot" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
