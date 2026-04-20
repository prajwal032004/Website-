'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'

const TOTAL_FRAMES = 80

function pad(n: number) {
  return String(n).padStart(3, '0')
}

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
]

const socialLinks = [
  { href: 'https://www.instagram.com/byravenmusic/', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/byraven/', label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@byRaven',          label: 'YouTube' },
]

/* ─────────────────────────────────────────────
   Animated state shape
───────────────────────────────────────────── */
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

    // Mirror to BW canvas with grayscale filter applied via CSS
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
        colorP: seg(raw, 0,    0.60),   // BW → colour sweep (bottom-up)
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

  // Colour canvas clips from bottom upward: waveY goes 100% → 0%
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
      {/* ── Tall scroll tunnel ── */}
      <div className="footer-tunnel" ref={tunnelRef}>

        {/* Sticky viewport */}
        <div className="footer-sticky" ref={stickyRef}>

          {/*
           * Two canvas layers stacked:
           *   bwCanvasRef  — greyscale (CSS filter), always visible
           *   canvasRef    — full colour, clipped from bottom upward
           * As colorP increases the colour layer sweeps upward revealing colour.
           */}
          <canvas
            ref={bwCanvasRef}
            className="footer-seq-canvas footer-seq-canvas--bw"
          />
          <canvas
            ref={canvasRef}
            className="footer-seq-canvas footer-seq-canvas--colour"
            style={{ clipPath: `inset(${waveY}% 0 0 0)` }}
          />

          {/* Gradient overlay */}
          <div className="footer-seq-overlay" />

          {/* ── Info content ── */}
          <div className="footer-seq-inner">

            {/* Reveal line */}
            <div
              className="footer-seq-reveal-line"
              style={{ transform: `scaleX(${lineP})`, transition: 'none' }}
            />

            {/* Headline */}
            <div className="footer-seq-title" style={headStyle}>
              <h5 className="footer-seq-h5">
                Let&rsquo;s make something
                <br />
                that moves people.
                <br />
                <a href="mailto:hello@byraven.com" className="footer-seq-mailto">
                  hello@byraven.com
                </a>
              </h5>
            </div>

            {/* 4-column grid */}
            <div className="footer-seq-grid" style={gridStyle}>

              {/* (a.) Contact */}
              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow">
                  <span className="footer-seq-alpha">(a.)</span> Contact
                </div>
                <p className="footer-seq-body">
                  hello@byraven.com<br />
                  The Netherlands
                </p>
                <div className="footer-seq-links">
                  <a href="mailto:hello@byraven.com" className="footer-seq-ulink">
                    Send an email
                  </a>
                </div>
              </div>

              {/* (b.) Services */}
              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow">
                  <span className="footer-seq-alpha">(b.)</span> Services
                </div>
                <div className="footer-seq-links">
                  {['Original Music','Music Production','Sonic Branding','Sound Design','Post Production'].map(s => (
                    <span key={s} className="footer-seq-ulink" style={{ cursor: 'default' }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* (c.) Newsletter */}
              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow">
                  <span className="footer-seq-alpha">(c.)</span> Newsletter
                </div>
                <p className="footer-seq-body">
                  Stay updated on our latest work.<br />
                  No spam — only music.
                </p>
                {formStatus === 'success' ? (
                  <p className="footer-seq-success">Thank you! You&rsquo;re subscribed.</p>
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
                    />
                    <button type="submit" className="footer-seq-btn">JOIN</button>
                  </form>
                )}
              </div>

              {/* (d.) Follow */}
              <div className="footer-seq-col">
                <div className="footer-seq-eyebrow">
                  <span className="footer-seq-alpha">(d.)</span> Follow
                </div>
                <div className="footer-seq-links">
                  {socialLinks.map(s => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-seq-ulink"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="footer-seq-bottom" style={botStyle}>
              <nav className="footer-nav">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} className="footer-nav-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="footer-left">
                <svg
                  className="footer-logo-icon"
                  viewBox="0 0 998 779"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="footer-rights">© by hub — all rights reserved</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}