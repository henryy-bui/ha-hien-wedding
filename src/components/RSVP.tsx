import { type FormEvent, useState } from 'react'
import confetti from 'canvas-confetti'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './RSVP.css'

interface FormState {
  name: string
  attending: 'yes' | 'no' | ''
  guests: string
}

interface FormErrors {
  name?: string
  attending?: string
  guests?: string
}

export default function RSVP() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const [form, setForm] = useState<FormState>({ name: '', attending: '', guests: '1' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ và tên.'
    if (!form.attending) e.attending = 'Vui lòng cho chúng mình biết bạn có tham dự không.'
    if (form.attending === 'yes' && parseInt(form.guests) < 1) {
      e.guests = 'Số lượng khách phải ít nhất là 1.'
    }
    return e
  }

  function fireConfetti() {
    const colors = ['#C9A96E', '#E8A598', '#F5D5CF', '#FFF8F0', '#E8D5B0']
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors })
    setTimeout(() => confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 }, colors }), 300)
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors }), 500)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitted(true)
    if (form.attending === 'yes') fireConfetti()
  }

  return (
    <section className="rsvp-bg" ref={sectionRef} id="rsvp">
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="reveal">
          <span className="section-label">Xác Nhận Tham Dự</span>
          <h2 className="section-title">Bạn Có Tham Dự Không?</h2>
          <p className="rsvp-sub reveal reveal-delay-1">
            Hãy cho chúng mình biết trước ngày <strong>20 tháng 05 năm 2026</strong> nhé.
          </p>
          <div className="section-divider" />
        </div>

        <div className="rsvp-card reveal reveal-delay-2">
          {submitted ? (
            <div className="rsvp-success">
              <span className="rsvp-success-icon">{form.attending === 'yes' ? '🎉' : '💌'}</span>
              <h3>
                {form.attending === 'yes'
                  ? `Cảm ơn ${form.name}! Chúng mình rất vui khi bạn sẽ có mặt!`
                  : `Cảm ơn ${form.name} đã phản hồi!`}
              </h3>
              <p>
                {form.attending === 'yes'
                  ? 'Hẹn gặp bạn ngày 31 tháng 05 nhé! Nhớ ăn mặc thật đẹp 😊'
                  : 'Dù vắng mặt, bạn vẫn luôn trong trái tim của chúng mình ❤️'}
              </p>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
              <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="rsvp-name">Họ và Tên</label>
                <input
                  id="rsvp-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.attending ? 'has-error' : ''}`}>
                <label>Bạn có tham dự không?</label>
                <div className="radio-group">
                  {([
                    { value: 'yes', label: '🥂 Có, tôi sẽ đến!' },
                    { value: 'no',  label: '😢 Rất tiếc, tôi không thể đến' },
                  ] as const).map(({ value, label }) => (
                    <label key={value} className={`radio-opt ${form.attending === value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="attending"
                        value={value}
                        checked={form.attending === value}
                        onChange={() => setForm((f) => ({ ...f, attending: value }))}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {errors.attending && <span className="form-error">{errors.attending}</span>}
              </div>

              {form.attending === 'yes' && (
                <div className={`form-group ${errors.guests ? 'has-error' : ''}`}>
                  <label htmlFor="rsvp-guests">Số lượng khách (kể cả bạn)</label>
                  <input
                    id="rsvp-guests"
                    type="number"
                    min="1"
                    max="10"
                    value={form.guests}
                    onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                  />
                  {errors.guests && <span className="form-error">{errors.guests}</span>}
                </div>
              )}

              <button type="submit" className="rsvp-btn">Gửi Xác Nhận ✨</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
