import { useScrollReveal } from "../hooks/useScrollReveal";
import "./OurStory.css";

const MILESTONES = [
  {
    year: "2020",
    emoji: "💫",
    title: "Lần đầu gặp gỡ",
    desc: "Gặp nhau tại buổi họp Đội IT Supporter với ấn tượng đầu tiên là... chẳng ưa gì nhau. Nhưng định mệnh đã xoay chuyển vào buổi tối sinh nhật Đội, nơi những lời chào đầu tiên mở ra một hành trình tình yêu không ngờ tới",
  },
  {
    year: "2020",
    emoji: "🌊",
    title: "Mở lòng",
    desc: "Từ hai kẻ 'ghét nhau' trong Đội, chỉ sau vài cuộc trò chuyện đêm sinh nhật, tụi mình đã tìm thấy 'tần số' chung và chọn đồng hành cùng nhau. Đó là một hành trình dài từ những ngày cùng nhau chạy deadline bài tập, cùng trải qua cảm giác hồi hộp ngày tốt nghiệp cho đến lúc mỗi đứa một định hướng riêng. Dù bận rộn với công việc nhưng tụi mình vẫn luôn là điểm tựa, cùng nhau trưởng thành và sẻ chia mọi áp lực đầu đời.",
  },
  {
    year: "2026",
    emoji: "🎊",
    title: "Lời hứa trọn đời",
    desc: "6 năm bên nhau, từ những sinh viên ngây ngô đến khi trưởng thành với công việc riêng, chúng mình đã cùng nhau đi qua thật nhiều cột mốc. Và hôm nay, sau hơn 2000 ngày gắn bó, tụi mình hạnh phúc khi quyết định cùng nhau xây dựng một gia đình nhỏ, viết tiếp chương mới của cuộc đời bằng một đám cưới hạnh phúc vào 31/05/2026",
  },
];

export default function OurStory() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      className="our-story-bg"
      ref={sectionRef}
      id="our-story"
      data-wipe="right"
    >
      <div className="section">
        <div className="reveal" style={{ textAlign: "center" }}>
          <span className="section-label">Câu Chuyện Của Chúng Mình</span>
          <h2 className="section-title">Hành Trình Tình Yêu</h2>
          <div className="section-divider" />
        </div>

        <div className="timeline">
          {MILESTONES.map((m, i) => (
            <div
              key={m.year}
              className={`timeline-item reveal reveal-delay-${i + 1} ${
                i % 2 === 0 ? "tl-left reveal-left" : "tl-right reveal-right"
              }`}
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
  );
}
