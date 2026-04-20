'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'

const TOTAL_FRAMES = 80

function pad(n: number) {
  return String(n).padStart(3, '0')
}

/* ─── Animated state shape ─── */
interface AnimState {
  colorP:    number   // 0→1  color-wash from BW to colour
  lineP:     number   // 0→1  reveal line scale
  headP:     number   // 0→1  headline fade+slide
  gridP:     number   // 0→1  grid fade+slide
  botP:      number   // 0→1  bottom bar fade+slide
}

const INIT_ANIM: AnimState = { colorP:0, lineP:0, headP:0, gridP:0, botP:0 }

/* Ease in-out quad */
function ease(t: number) {
  return t < 0.5 ? 2*t*t : -1+(4-2*t)*t
}

/* Map raw [lo, hi] → eased [0, 1] */
function seg(raw: number, lo: number, hi: number) {
  return ease(Math.min(Math.max((raw - lo) / (hi - lo), 0), 1))
}

export default function Footer() {
  const tunnelRef    = useRef<HTMLDivElement>(null)
  const stickyRef    = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const bwCanvasRef  = useRef<HTMLCanvasElement>(null)   // grayscale copy
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const frameRef     = useRef(0)
  const rafRef       = useRef<number | null>(null)

  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle')
  const [email,      setEmail]      = useState('')
  const [anim,       setAnim]       = useState<AnimState>(INIT_ANIM)

  /* ── Draw a single frame to a canvas (colour) ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = imagesRef.current[index]
    if (!img || !img.complete) return
    const { width: cw, height: ch } = canvas
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const sw = img.naturalWidth  * scale
    const sh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh)

    // Mirror to BW canvas
    const bw = bwCanvasRef.current
    if (!bw) return
    const bCtx = bw.getContext('2d')
    if (!bCtx) return
    bCtx.clearRect(0, 0, cw, ch)
    bCtx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh)
  }, [])

  /* ── Preload all frames ── */
  useEffect(() => {
    const imgs: HTMLImageElement[] = []
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/images72/ezgif-frame-${pad(i)}.jpg`
      img.onload = () => { if (i === 1) drawFrame(0) }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [drawFrame])

  /* ── Scroll handler ── */
  useEffect(() => {
    function onScroll() {
      const tunnel = tunnelRef.current
      if (!tunnel) return
      const rect       = tunnel.getBoundingClientRect()
      const vh         = window.innerHeight
      const scrollable = tunnel.offsetHeight - vh
      const scrolled   = Math.min(Math.max(-rect.top, 0), scrollable)
      const raw        = scrollable > 0 ? scrolled / scrollable : 0

      /* Image sequence: advances through first 85 % of scroll */
      const frameProgress = Math.min(raw / 0.85, 1)
      const target = Math.round(frameProgress * (TOTAL_FRAMES - 1))
      if (target !== frameRef.current) {
        frameRef.current = target
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(target))
      }

      /* Animated values */
      setAnim({
        colorP: seg(raw, 0,    0.60),   // BW → colour sweep
        lineP:  seg(raw, 0.27, 0.55),   // reveal line
        headP:  seg(raw, 0.30, 0.62),   // headline
        gridP:  seg(raw, 0.45, 0.72),   // grid
        botP:   seg(raw, 0.60, 0.82),   // bottom bar
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [drawFrame])

  /* ── Resize canvases ── */
  useEffect(() => {
    function resize() {
      const sticky = stickyRef.current
      if (!sticky) return
      const w = sticky.clientWidth
      const h = sticky.clientHeight
      ;[canvasRef.current, bwCanvasRef.current].forEach(c => {
        if (!c) return
        c.width  = w
        c.height = h
      })
      drawFrame(frameRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setTimeout(() => setFormStatus('success'), 600)
  }

  /* ── Derived inline styles ── */
  const { colorP, lineP, headP, gridP, botP } = anim
  const waveY = Math.round((1 - colorP) * 100)

  const headStyle: React.CSSProperties = {
    opacity:   headP,
    transform: `translateY(${(1 - headP) * 36}px)`,
    transition: 'none',
  }
  const gridStyle: React.CSSProperties = {
    opacity:   gridP,
    transform: `translateY(${(1 - gridP) * 24}px)`,
    transition: 'none',
  }
  const botStyle: React.CSSProperties = {
    opacity:   botP,
    transform: `translateY(${(1 - botP) * 18}px)`,
    transition: 'none',
  }

  return (
    <footer>
      <div className="footer-tunnel" ref={tunnelRef}>
        <div className="footer-sticky" ref={stickyRef}>

          <canvas
            ref={bwCanvasRef}
            className="footer-seq-canvas footer-seq-canvas--bw"
          />
          <canvas
            ref={canvasRef}
            className="footer-seq-canvas footer-seq-canvas--colour"
            style={{ clipPath: `inset(${waveY}% 0 0 0)` }}
          />

          <div className="footer-seq-overlay" />

          <div className="footer-seq-inner">
            <div
              className="footer-seq-reveal-line"
              style={{ transform: `scaleX(${lineP})`, transition: 'none' }}
            />

            <div className="footer-seq-title" style={headStyle}>
              <h5 className="footer-seq-h5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Let&rsquo;s make an impact together.
                <br />
                <a href="mailto:hello@madeinevolve.com" className="footer-seq-mailto">
                  hello@madeinevolve.com
                </a>
              </h5>
            </div>

            <div className="footer-seq-grid" style={gridStyle}>
              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <span className="footer-seq-alpha">(a.)</span> CONTACT
                </div>
                <div className="footer-seq-body" style={{ fontFamily: "'Space Mono', monospace" }}>
                  hello@madeinevolve.com<br />
                  Via Rosalba Carriera, 26 | 41126 Modena (Italy)
                </div>
                <div className="footer-seq-links">
                  <a href="https://eu1.hs-data-privacy.com/request/snVsCRNyWbjQ_TU5bILZBQ" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Privacy Data Removal
                  </a>
                </div>
              </div>

              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <span className="footer-seq-alpha">(b.)</span> LEGAL
                </div>
                <div className="footer-seq-body" style={{ fontFamily: "'Space Mono', monospace" }}>
                  ©2008-2026 Evolve S.r.l. P.IVA IT03497200364 // REA MO392876 Capitale Sociale: 12.000 Eur
                </div>
                <div className="footer-seq-links">
                  <Link href="/privacy-policy" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Privacy Policy
                  </Link>
                  <Link href="/gdpr-information" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Other Policies
                  </Link>
                </div>
              </div>

              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <span className="footer-seq-alpha">(c.)</span> NEWSLETTER
                </div>
                <div className="footer-seq-body" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Get eCommerce insights in your inbox.<br />
                  No spam, just relevant stories.
                </div>
                {formStatus === 'success' ? (
                  <p className="footer-seq-success" style={{ fontFamily: "'Space Mono', monospace" }}>Thank you! Your submission has been received!</p>
                ) : (
                  <form id="newsletter-form" className="footer-seq-form" onSubmit={handleSubmit}>
                    <input
                      id="footer-email"
                      type="email"
                      name="email"
                      maxLength={256}
                      placeholder="enter your email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="footer-seq-input"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    />
                    <button type="submit" className="footer-seq-btn" style={{ fontFamily: "'Space Mono', monospace" }}>JOIN NOW</button>
                  </form>
                )}
              </div>

              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <span className="footer-seq-alpha">(d.)</span> PRESS
                </div>
                <div className="footer-seq-links">
                  <a href="https://forbes.it/2024/05/07/creativita-digitale-e-integrazione-tecnologica-unalleanza-strategica-definisce-il-futuro-digitale-di-engine" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>Forbes</a>
                  <a href="https://www.pambianconews.com/2022/04/01/evolve-lecommerce-agency-cresce-del-78-con-partnership-a-provvigione-342942/" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>Pambianco News</a>
                  <a href="https://www.pambianconews.com/2022/06/27/pollini-scommette-sullomnichannel-con-lecommerce-agency-evolve-350045/" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>Pambianco News</a>
                  <a href="https://forbes.it/2022/12/14/progetti-e-commerce-agency-settore-fashion" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>Forbes</a>
                  <div style={{ height: '0.8rem' }} />
                  <a href="https://www.instagram.com/madeinevolve" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>Instagram</a>
                  <a href="https://www.linkedin.com/company/madeinevolve/" target="_blank" rel="noopener noreferrer" className="footer-seq-ulink" style={{ fontFamily: "'Space Mono', monospace" }}>Linkedin</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}