import { useState } from 'react'
import confetti from 'canvas-confetti'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSide } from '../sideContext'
import './RSVP.css'

interface FormState {
  name: string
  note: string
}

interface FormErrors {
  name?: string
  note?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT

export default function RSVP() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const side = useSide()
  const [form, setForm] = useState<FormState>({ name: '', note: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ và tên.'
    if (!form.note.trim()) e.note = 'Vui lòng để lại lời chúc cho cô dâu chú rể.'
    return e
  }

  function fireConfetti() {
    // Resolve theme tokens at burst time so confetti always matches the active palette.
    const styles = getComputedStyle(document.documentElement)
    const colors = ['--gold', '--rose', '--rose-light', '--cream', '--gold-light']
      .map((token) => styles.getPropertyValue(token).trim())
      .filter(Boolean)
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors })
    setTimeout(() => confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.7 }, colors }), 300)
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors }), 500)
  }

  async function submitRsvp() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStatus('submitting')

    const payload = {
      side,
      name: form.name.trim(),
      note: form.note.trim(),
      submittedAt: new Date().toISOString(),
    }

    try {
      if (!ENDPOINT) {
        // No endpoint configured — log to console so the host can still see what was submitted
        // during local development. The thank-you screen still shows.
        console.warn('[RSVP] VITE_RSVP_ENDPOINT not set — submission not persisted.', payload)
      } else {
        // Apps Script Web Apps don't support CORS preflight, so POST as text/plain
        // (a "simple request" content-type) — the script reads e.postData.contents.
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        })
      }
      setStatus('success')
      fireConfetti()
    } catch (err) {
      console.error('[RSVP] submit failed', err)
      setStatus('error')
    }
  }

  function retry() {
    setStatus('idle')
  }

  const submitting = status === 'submitting'
  const success    = status === 'success'

  return (
    <section className="rsvp-bg" ref={sectionRef} id="rsvp" data-wipe="left">
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="reveal">
          <span className="section-label">Lời Chúc Của Bạn</span>
          <h2 className="section-title">Gửi Lời Chúc Đến Cô Dâu Chú Rể</h2>
          <p className="rsvp-sub reveal reveal-delay-1">
            Một lời chúc nhỏ từ bạn sẽ là món quà lớn nhất cho ngày trọng đại của chúng mình.
          </p>
          <div className="section-divider" />
        </div>

        <div className="rsvp-card reveal reveal-delay-2 reveal-drop">
          {success ? (
            <div className="rsvp-success">
              <span className="rsvp-success-icon">💌</span>
              <h3>Cảm ơn {form.name}!</h3>
              <p>Lời chúc của bạn đã được gửi đến Hà &amp; Hiền ❤️</p>
            </div>
          ) : (
            <form
              className="rsvp-form"
              onSubmit={(e) => {
                e.preventDefault()
                void submitRsvp()
              }}
              noValidate
            >
              <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="rsvp-name">Họ và Tên</label>
                <input
                  id="rsvp-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  disabled={submitting}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.note ? 'has-error' : ''}`}>
                <label htmlFor="rsvp-note">Lời Chúc</label>
                <textarea
                  id="rsvp-note"
                  rows={4}
                  maxLength={500}
                  placeholder="Gửi lời chúc đến cô dâu chú rể..."
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  disabled={submitting}
                />
                {errors.note && <span className="form-error">{errors.note}</span>}
              </div>

              {status === 'error' && (
                <div className="rsvp-banner rsvp-banner--error" role="alert">
                  Có lỗi khi gửi. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng mình.
                  <button type="button" className="rsvp-banner-retry" onClick={retry}>Thử lại</button>
                </div>
              )}

              <button type="submit" className="rsvp-btn" disabled={submitting}>
                {submitting ? 'Đang gửi…' : 'Gửi Lời Chúc ✨'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
