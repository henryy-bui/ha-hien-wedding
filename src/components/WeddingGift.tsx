import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSide } from "../sideContext";
import type { Side } from "../sideConfig";
import "./WeddingGift.css";

interface GiftCard {
  side: Side;
  role: string;
  roleEn: string;
  name: string;
  accent: "gold" | "rose";
  qrUrl: string;
  bankName: string;
  accountNumber: string;
  accountLabel: string;
  holder: string;
  branch: string;
}

const CARDS: GiftCard[] = [
  {
    side: "groom",
    role: "Chú Rể",
    roleEn: "Groom",
    name: "Văn Hà",
    accent: "gold",
    qrUrl: "/qr-groom.jpg.jpg",
    bankName: "VietinBank",
    accountNumber: "0359830512",
    accountLabel: "Số tài khoản (Alias)",
    holder: "BUI VAN HA",
    branch: "CN TP Hà Nội — Hội Sở",
  },
  {
    side: "bride",
    role: "Cô Dâu",
    roleEn: "Bride",
    name: "Thanh Hiền",
    accent: "rose",
    qrUrl: "/qr-bride.jpg.jpg",
    bankName: "Vietcombank",
    accountNumber: "1025725805",
    accountLabel: "Số tài khoản",
    holder: "PHAM THI THANH HIEN",
    branch: "PGD Lê Quang Đạo",
  },
];

export default function WeddingGift() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const side = useSide();
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const visibleCards =
    side === "combined" ? CARDS : CARDS.filter((c) => c.side === side);
  const isSingle = visibleCards.length === 1;

  const toggle = (key: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section
      className="gift-bg"
      ref={sectionRef}
      id="wedding-gift"
      data-wipe="up"
    >
      <div className="section">
        <div className="reveal" style={{ textAlign: "center" }}>
          <span className="section-label">Hộp Mừng Cưới</span>
          <h2 className="section-title">Mừng Cưới</h2>
          <div className="section-divider" />
          <p className="gift-intro">
            Sự hiện diện của bạn chính là món quà ý nghĩa nhất với tụi mình. Nếu
            bạn muốn gửi thêm chút lộc đầu, hãy chạm vào hộp quà bên dưới để mở
            mã QR.
          </p>
        </div>

        <div className={`gift-spread${isSingle ? " gift-spread-single" : ""}`}>
          {visibleCards.map((c, i) => {
            const revealSide = isSingle ? "zoom" : i === 0 ? "left" : "right";
            const isOpen = openSet.has(c.roleEn);

            return (
              <article
                key={c.roleEn}
                className={`gift-card accent-${
                  c.accent
                } reveal reveal-${revealSide} reveal-delay-${i + 1}`}
              >
                <span className="gift-side-label" aria-hidden="true">
                  {c.roleEn}
                </span>

                <header className="gift-card-head">
                  <span className="gift-role">— {c.role} —</span>
                  <h3 className="gift-name">{c.name}</h3>
                </header>

                <div className="gift-stage" aria-live="polite">
                  {!isOpen ? (
                    <button
                      key="closed"
                      type="button"
                      className="gift-closed"
                      onClick={() => toggle(c.roleEn)}
                      aria-expanded={false}
                      aria-label={`Mở hộp mừng cưới của ${c.name}`}
                    >
                      <span className="gift-box" aria-hidden="true">
                        <span className="gift-box-body" />
                        <span className="gift-box-lid" />
                        <span className="gift-box-ribbon-v" />
                        <span className="gift-box-ribbon-h" />
                        <span className="gift-box-bow" />
                        <span className="gift-sparkle gift-sparkle-1">✦</span>
                        <span className="gift-sparkle gift-sparkle-2">✧</span>
                        <span className="gift-sparkle gift-sparkle-3">✦</span>
                      </span>
                      <span className="gift-cta">
                        <span className="gift-cta-icon" aria-hidden="true">
                          ✨
                        </span>
                        Mở Hộp Mừng Cưới
                      </span>
                    </button>
                  ) : (
                    <div key="opened" className="gift-opened">
                      <div className="gift-qr-frame">
                        <img
                          src={c.qrUrl}
                          alt={`Mã QR chuyển khoản — ${c.name}`}
                          className="gift-qr"
                          loading="lazy"
                        />
                      </div>

                      <dl className="gift-info">
                        <div className="gift-row">
                          <dt>Ngân hàng</dt>
                          <dd>{c.bankName}</dd>
                        </div>
                        <div className="gift-row gift-row-account">
                          <dt>{c.accountLabel}</dt>
                          <dd className="gift-account">{c.accountNumber}</dd>
                        </div>
                        <div className="gift-row">
                          <dt>Chủ tài khoản</dt>
                          <dd>{c.holder}</dd>
                        </div>
                        <div className="gift-row">
                          <dt>Chi nhánh</dt>
                          <dd className="gift-branch">{c.branch}</dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        className="gift-close-btn"
                        onClick={() => toggle(c.roleEn)}
                      >
                        ↺ Đóng hộp
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
