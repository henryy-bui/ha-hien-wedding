import { useScrollReveal } from "../hooks/useScrollReveal";
import "./Introduction.css";

interface Fact {
  emoji: string;
  text: string;
}

interface Parents {
  father: string;
  mother: string;
}

interface Person {
  numeral: string;
  role: string;
  roleEn: string;
  name: string;
  monogram: string;
  photoBg: string;
  accent: "gold" | "rose";
  bio: string;
  facts: Fact[];
  parents: Parents;
}

const PEOPLE: Person[] = [
  {
    numeral: "I",
    role: "Chú Rể",
    roleEn: "Groom",
    name: "Văn Hà",
    monogram: "V",
    photoBg: "linear-gradient(155deg, #C9A96E 0%, #E8D5B0 55%, #FBE8D8 100%)",
    accent: "gold",
    bio: "Một chàng trai chân thành với nụ cười ấm áp và niềm tin vững chắc rằng tình yêu là hành trình đáng trân trọng nhất hai người cùng đi.",
    facts: [],
    parents: {
      father: "Ông Nguyễn Văn A",
      mother: "Bà Trần Thị B",
    },
  },
  {
    numeral: "II",
    role: "Cô Dâu",
    roleEn: "Bride",
    name: "Thanh Hiền",
    monogram: "T",
    photoBg: "linear-gradient(155deg, #E8A598 0%, #F5D5CF 55%, #FFF8F0 100%)",
    accent: "rose",
    bio: "Một cô gái dịu dàng với đôi mắt biết cười và tâm hồn lãng mạn — luôn tin rằng những điều nhỏ bé tạo nên hạnh phúc lớn lao nhất.",
    facts: [],
    parents: {
      father: "Ông Lê Văn C",
      mother: "Bà Phạm Thị D",
    },
  },
];

export default function Introduction() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      className="intro-bg"
      ref={sectionRef}
      id="introduction"
      data-wipe="up"
    >
      <div className="section">
        <div className="reveal intro-header">
          <span className="section-label">Cô Dâu &amp; Chú Rể</span>
          <h2 className="section-title intro-section-title">Đôi Bạn Đời</h2>
          <div className="section-divider" />
        </div>

        <div className="intro-spread">
          {PEOPLE.map((p, i) => {
            const side = i === 0 ? "left" : "right";
            return (
              <article
                key={p.name}
                className={`intro-page intro-page-${side} accent-${
                  p.accent
                } reveal reveal-${side} reveal-delay-${i + 1}`}
              >
                <span className="intro-side-label" aria-hidden="true">
                  {p.roleEn}
                </span>

                <div className="intro-photo-frame">
                  <span className="intro-numeral" aria-hidden="true">
                    {p.numeral}
                  </span>
                  <div
                    className="intro-photo"
                    style={{ background: p.photoBg }}
                  >
                    <span className="intro-monogram">{p.monogram}</span>
                  </div>
                  <span className="intro-photo-caption">— {p.role} —</span>
                </div>

                <div className="intro-text">
                  <h3 className="intro-name">{p.name}</h3>
                  <div className="intro-rule" />
                  <p className="intro-bio">{p.bio}</p>
                  {p.facts.length > 0 && (
                    <ul className="intro-facts">
                      {p.facts.map((f) => (
                        <li key={f.text}>
                          <span className="intro-fact-emoji" aria-hidden="true">
                            {f.emoji}
                          </span>
                          <span>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="intro-parents">
                    <span className="intro-parents-label">Phụ Mẫu</span>
                    <p className="intro-parent">{p.parents.father}</p>
                    <p className="intro-parent">{p.parents.mother}</p>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="intro-spine" aria-hidden="true">
            <span className="intro-spine-amp">&amp;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
