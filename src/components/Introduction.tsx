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
  photoUrl: string;
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
    photoBg:
      "linear-gradient(155deg, var(--gold) 0%, var(--gold-light) 55%, var(--cream-dark) 100%)",
    photoUrl: "/images/groom.jpg",
    accent: "gold",
    bio: "Là một lập trình viên, anh không chỉ viết code để xây dựng tương lai mà còn 'debug' mọi khó khăn để xây dựng một tình yêu vững bền.",
    facts: [],
    parents: {
      father: "Ông Bùi Văn Sơn",
      mother: "Bà Nguyễn Thị Là",
    },
  },
  {
    numeral: "II",
    role: "Cô Dâu",
    roleEn: "Bride",
    name: "Thanh Hiền",
    monogram: "T",
    photoBg:
      "linear-gradient(155deg, var(--rose) 0%, var(--rose-light) 55%, var(--cream) 100%)",
    photoUrl: "/images/bride.jpg",
    accent: "rose",
    bio: "Là một cô gái tinh tế và sâu sắc, cô ấy không chỉ tìm ra 'lỗi' trong phần mềm mà còn tìm thấy và sửa chữa mọi 'lỗi' trong trái tim người bạn đời của mình.",
    facts: [],
    parents: {
      father: "",
      mother: "Bà Tống Thị Nếp",
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

                <div className="intro-page-content">
                  <div className="intro-photo-frame">
                    <span className="intro-numeral" aria-hidden="true">
                      {p.numeral}
                    </span>
                    <div className="intro-photo">
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        style={{
                          scale: p.roleEn === "Bride" ? 2 : 1,
                          transform:
                            p.roleEn === "Bride"
                              ? "translateY(10%) translateX(-5%)"
                              : "none",
                        }}
                      />
                    </div>
                    <span className="intro-photo-caption">— {p.role} —</span>
                  </div>

                  <div className="intro-text">
                    <h3 className="intro-name">{p.name}</h3>
                    {p.facts.length > 0 && (
                      <ul className="intro-facts">
                        {p.facts.map((f) => (
                          <li key={f.text}>
                            <span
                              className="intro-fact-emoji"
                              aria-hidden="true"
                            >
                              {f.emoji}
                            </span>
                            <span>{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="intro-parents">
                  <span className="intro-parents-label">Phụ Mẫu</span>
                  <p className="intro-parent">{p.parents.father}</p>
                  <p className="intro-parent">{p.parents.mother}</p>
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
