'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ContactPage() {
  useScrollReveal()
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', service: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div>
      <div className="contact-page">
        {/* ── Heading ── */}
        <h1 className="contact-heading">
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{
              display: 'block',
              animation: 'heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.8s both',
            }}>
              let&apos;s make
            </span>
          </span>
          <span style={{ display: 'block', overflow: 'hidden' }}>
            <span style={{
              display: 'block',
              animation: 'heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) 1s both',
            }}>
              some noise.
            </span>
          </span>
        </h1>

        <div className="contact-grid">
          {/* ── Left: Info ── */}
          <div className="contact-info reveal">
            <p>
              Got a project in mind? A brief to share? Or just want to talk sound?
              We&apos;re always open for a conversation. Drop us a line and we&apos;ll
              get back to you as soon as possible.
            </p>

            <a href="mailto:info@byraven.com" className="contact-email">
              info@byraven.com
            </a>

            <div style={{ marginBottom: '2rem' }}>
              <div className="contact-meta-label">Based in</div>
              <div className="contact-meta-value">
                The Netherlands<br />Worldwide Mindset
              </div>
            </div>

            <div>
              <div className="contact-meta-label">Services</div>
              <div className="contact-services-list">
                Original Music<br />
                Music Production<br />
                Sonic Branding<br />
                Sound Design<br />
                Post Production
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="reveal" style={{ transitionDelay: '0.15s' }}>
            {submitted ? (
              <div className="success-message">
                <div className="success-heading">message received.</div>
                <p className="success-sub">We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <div className="contact-form glass-dark p-8 md:p-12 rounded-3xl">
                <div className="form-field">
                  <label className="form-label" htmlFor="name">Your Name *</label>
                  <input
                    className="form-input"
                    id="name" name="name" type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="company">Company / Brand</label>
                  <input
                    className="form-input"
                    id="company" name="company" type="text"
                    placeholder="ACME Corp"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input
                    className="form-input"
                    id="email" name="email" type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="service">Service You Need</label>
                  <select
                    className="form-select"
                    id="service" name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="original-music">Original Music</option>
                    <option value="music-production">Music Production</option>
                    <option value="sonic-branding">Sonic Branding</option>
                    <option value="sound-design">Sound Design</option>
                    <option value="post-production">Post Production</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="message">Tell Us About Your Project *</label>
                  <textarea
                    className="form-textarea"
                    id="message" name="message"
                    placeholder="Describe your project, timeline, and any relevant details..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  className="form-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}