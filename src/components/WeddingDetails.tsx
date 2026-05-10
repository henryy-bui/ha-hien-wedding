import { useScrollReveal } from "../hooks/useScrollReveal";
import WeddingCalendar from "./WeddingCalendar";
import "./WeddingDetails.css";

export default function WeddingDetails() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      className="details-bg"
      ref={sectionRef}
      id="details"
      data-wipe="left"
    >
      <div className="section" style={{ textAlign: "center" }}>
        <div className="reveal">
          <span className="section-label">Thông Tin Đám Cưới</span>
          <h2 className="section-title">Chi Tiết Buổi Lễ</h2>
          <div className="section-divider" />
        </div>

        <WeddingCalendar />
      </div>
    </section>
  );
}
