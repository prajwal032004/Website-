'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'

const TOTAL_FRAMES = 80

function pad(n: number) {
  return String(n).padStart(3, '0')
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: 'https://www.instagram.com/byravenmusic/', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/byraven/', label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@byRaven', label: 'YouTube' },
]

/* ─────────────────────────────────────────────
   Animated state shape
───────────────────────────────────────────── */
interface AnimState {
  colorP: number  // 0→1  colour-wash from BW → colour (bottom-up clip)
  lineP: number  // 0→1  reveal line scaleX
  headP: number  // 0→1  headline fade + slide
  gridP: number  // 0→1  grid fade + slide
  botP: number  // 0→1  bottom bar fade + slide
}

const INIT_ANIM: AnimState = { colorP: 0, lineP: 0, headP: 0, gridP: 0, botP: 0 }

/** Ease in-out quad */
function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/** Map raw progress [lo, hi] → eased [0, 1], clamped */
function seg(raw: number, lo: number, hi: number): number {
  return ease(Math.min(Math.max((raw - lo) / (hi - lo), 0), 1))
}

export default function Footer() {
  const tunnelRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bwCanvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle')
  const [email, setEmail] = useState('')
  const [anim, setAnim] = useState<AnimState>(INIT_ANIM)

  /* ──────────────────────────────────────────
     Draw a frame to both canvas layers
  ─────────────────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const colCanvas = canvasRef.current
    const bwCanvas = bwCanvasRef.current
    if (!colCanvas || !bwCanvas) return

    const colCtx = colCanvas.getContext('2d')
    const bwCtx = bwCanvas.getContext('2d')
    if (!colCtx || !bwCtx) return

    const img = imagesRef.current[index]
    if (!img || !img.complete) return

    const { width: cw, height: ch } = colCanvas

    // Cover-fit calculation (same as CSS object-fit: cover)
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const sw = img.naturalWidth * scale
    const sh = img.naturalHeight * scale
    const sx = (cw - sw) / 2
    const sy = (ch - sh) / 2

    colCtx.clearRect(0, 0, cw, ch)
    colCtx.drawImage(img, sx, sy, sw, sh)

    bwCtx.clearRect(0, 0, cw, ch)
    bwCtx.drawImage(img, sx, sy, sw, sh)
  }, [])

  /* ──────────────────────────────────────────
     Preload all frames
  ─────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────
     Scroll handler — drives frame + anim state
  ─────────────────────────────────────────── */
  useEffect(() => {
    function onScroll() {
      const tunnel = tunnelRef.current
      if (!tunnel) return

      const rect = tunnel.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollable = tunnel.offsetHeight - vh
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable)
      const raw = scrollable > 0 ? scrolled / scrollable : 0

      const frameProgress = Math.min(raw / 0.85, 1)
      const target = Math.round(frameProgress * (TOTAL_FRAMES - 1))

      if (target !== frameRef.current) {
        frameRef.current = target
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(target))
      }

      setAnim({
        colorP: seg(raw, 0.00, 0.60),
        lineP: seg(raw, 0.27, 0.55),
        headP: seg(raw, 0.30, 0.62),
        gridP: seg(raw, 0.45, 0.72),
        botP: seg(raw, 0.60, 0.82),
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [drawFrame])

  /* ──────────────────────────────────────────
     Resize both canvases to match sticky div
  ─────────────────────────────────────────── */
  useEffect(() => {
    function resize() {
      const sticky = stickyRef.current
      if (!sticky) return
      const w = sticky.clientWidth
      const h = sticky.clientHeight
        ;[canvasRef.current, bwCanvasRef.current].forEach(c => {
          if (!c) return
          c.width = w
          c.height = h
        })
      drawFrame(frameRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  /* ──────────────────────────────────────────
     Newsletter submit
  ─────────────────────────────────────────── */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setTimeout(() => setFormStatus('success'), 600)
  }

  /* ──────────────────────────────────────────
     Derived inline styles (scroll-driven, no CSS transitions)
  ─────────────────────────────────────────── */
  const { colorP, lineP, headP, gridP, botP } = anim

  // waveY: 100% = only BW visible; 0% = full colour visible
  const waveY = Math.round((1 - colorP) * 100)

  const headStyle: React.CSSProperties = {
    opacity: headP,
    transform: `translateY(${(1 - headP) * 36}px)`,
    transition: 'none',
  }

  const gridStyle: React.CSSProperties = {
    opacity: gridP,
    transform: `translateY(${(1 - gridP) * 24}px)`,
    transition: 'none',
  }

  const botStyle: React.CSSProperties = {
    opacity: botP,
    transform: `translateY(${(1 - botP) * 18}px)`,
    transition: 'none',
  }

  /* ──────────────────────────────────────────
     Render
  ─────────────────────────────────────────── */
  return (
    <>
      {/* ── All footer styles, colocated ── */}
      <style>{`

        /* ══════════════════════════════════════════
           FOOTER — scroll-driven image sequence
           ──────────────────────────────────────────
           Layer stack (all position: absolute, inset: 0):
             z-1  canvas--bw      greyscale (CSS filter)
             z-2  canvas--colour  colour, clipped bottom-up
             z-3  .f-overlay      gradient darken
             z-4  .f-inner        all text / UI
        ══════════════════════════════════════════ */

        /* ── Scroll tunnel ── */
        .f-tunnel {
          position: relative;
          height: 500vh;
          width: 100%;
        }

        /* ── Sticky viewport ── */
        .f-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--dark);
        }

        /* ── Canvas layers ── */
        .f-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .f-canvas--bw {
          z-index: 1;
          filter: grayscale(1) brightness(0.6);
        }

        .f-canvas--colour {
          z-index: 2;
          /* clip-path applied inline: inset(${waveY}% 0 0 0) */
        }

        /* ── Gradient overlay ── */
        .f-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.08) 28%,
            rgba(0,0,0,0.52) 68%,
            rgba(0,0,0,0.92) 100%
          );
          pointer-events: none;
        }

        /* ── Content container ── */
        .f-inner {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          padding: clamp(2rem, 4vw, 3.5rem) clamp(2rem, 5vw, 4rem) clamp(1.6rem, 3vw, 2.6rem);
          pointer-events: none;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .f-inner::-webkit-scrollbar { display: none; }

        /* ── Reveal line ──
           scaleX driven by scroll via inline style; origin = left */
        .f-reveal-line {
          flex-shrink: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            var(--accent) 0%,
            rgba(200,169,110,0.15) 100%
          );
          transform-origin: left center;
          margin-bottom: clamp(0.8rem, 2vh, 2rem);
        }

        /* ── Headline ──
           opacity + translateY driven inline by component */
        .f-title {
          margin-top: auto;
          margin-bottom: clamp(1.2rem, 3vh, 3rem);
          pointer-events: all;
        }

        .f-h5 {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 5.2vw, 5.8rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.015em;
          color: var(--light);
        }

        .f-mailto {
          display: inline-block;
          margin-top: 0.55rem;
          font-family: var(--font-sans);
          font-size: clamp(0.76rem, 1.5vw, 1.2rem);
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(200,169,110,0.3);
          padding-bottom: 0.12rem;
          transition: color 0.3s var(--ease-out), border-color 0.3s var(--ease-out);
        }

        .f-mailto:hover {
          color: var(--accent-light);
          border-color: rgba(200,169,110,0.7);
        }

        /* ── 4-column grid ──
           opacity + translateY driven inline by component */
        .f-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(1rem, 2.5vw, 2.5rem);
          border-top: 1px solid var(--line-mid);
          padding-top: clamp(0.9rem, 1.8vh, 1.6rem);
          margin-bottom: clamp(0.9rem, 1.8vh, 1.6rem);
          pointer-events: all;
          flex-shrink: 0;
        }

        .f-col {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        /* Eyebrow label */
        .f-eyebrow {
          display: flex;
          gap: 0.35rem;
          align-items: baseline;
          font-family: var(--font-mono);
          font-size: 0.54rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.32);
          margin-bottom: 0.5rem;
        }

        .f-alpha {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.82rem;
          font-weight: 300;
          color: var(--accent);
          line-height: 1;
        }

        /* Body copy */
        .f-body {
          font-family: var(--font-mono);
          font-size: 0.61rem;
          line-height: 2;
          color: rgba(240,237,230,0.42);
          margin-bottom: 0.35rem;
          font-weight: 400;
        }

        /* Vertical link list */
        .f-links {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        /* Individual link / service label */
        .f-ulink {
          font-family: var(--font-mono);
          font-size: 0.61rem;
          letter-spacing: 0.04em;
          color: rgba(240,237,230,0.58);
          text-decoration: none;
          width: fit-content;
          cursor: pointer;
          position: relative;
          padding-bottom: 1px;
          transition: color 0.25s var(--ease-out);
        }

        .f-ulink::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: currentColor;
          transform-origin: right;
          transform: scaleX(0);
          transition: transform 0.45s var(--ease-in-out);
        }

        a.f-ulink:hover { color: var(--accent); }

        a.f-ulink:hover::after {
          transform-origin: left;
          transform: scaleX(1);
        }

        /* ── Newsletter form ── */
        .f-form {
          display: flex;
          margin-top: 0.3rem;
        }

        .f-input {
          flex: 1;
          min-width: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(240,237,230,0.12);
          border-right: none;
          color: var(--light);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 400;
          padding: 0.5rem 0.75rem;
          outline: none;
          letter-spacing: 0.05em;
          transition: border-color 0.25s var(--ease-out), background 0.25s var(--ease-out);
        }

        .f-input::placeholder { color: rgba(240,237,230,0.22); }

        .f-input:focus {
          border-color: rgba(200,169,110,0.45);
          background: rgba(255,255,255,0.07);
        }

        .f-btn {
          background: var(--accent);
          border: 1px solid var(--accent);
          color: #0a0a0a;
          font-family: var(--font-mono);
          font-size: 0.54rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          padding: 0.5rem 0.9rem;
          cursor: pointer;
          transition: background 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .f-btn:hover {
          background: var(--accent-light);
          border-color: var(--accent-light);
        }

        .f-btn:active { opacity: 0.85; }

        /* Success state */
        .f-success {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin-top: 0.4rem;
          border-left: 2px solid rgba(200,169,110,0.36);
          padding-left: 0.6rem;
        }

        /* ── Bottom bar ──
           opacity + translateY driven inline by component */
        .f-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(240,237,230,0.1);
          padding-top: 0.85rem;
          flex-wrap: wrap;
          gap: 0.7rem;
          pointer-events: all;
          flex-shrink: 0;
        }

        /* Nav links row */
        .f-nav {
          display: flex;
          gap: 1.4rem;
          flex-wrap: wrap;
        }

        .f-nav-link {
          font-family: var(--font-mono);
          font-size: 0.53rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.32);
          text-decoration: none;
          transition: color 0.2s var(--ease-out);
          padding: 0.25rem 0;
        }

        .f-nav-link:hover { color: var(--light); }

        /* Logo + copyright */
        .f-left {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .f-logo-icon {
          width: 24px;
          height: 19px;
          color: rgba(240,237,230,0.34);
          transition: color 0.3s var(--ease-out);
          flex-shrink: 0;
        }

        .f-logo-icon:hover { color: rgba(240,237,230,0.6); }

        .f-rights {
          font-family: var(--font-sans);
          font-size: 0.48rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.22);
        }

        /* ══════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════ */

        @media (max-width: 1100px) {
          .f-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(1rem, 2vw, 2rem);
          }
        }

        @media (max-width: 768px) {
          .f-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 560px) {
          .f-inner {
            padding: 3.5rem 6% 1.8rem;
            gap: 1.8rem;
          }

          .f-title {
            margin-top: 0;
            margin-bottom: 0;
          }

          .f-h5 {
            font-size: clamp(1.7rem, 8vw, 2.4rem) !important;
            line-height: 1.14 !important;
            letter-spacing: -0.02em !important;
          }

          .f-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .f-body   { font-size: 0.65rem; }
          .f-eyebrow { font-size: 0.54rem; }
          .f-ulink  { font-size: 0.7rem; }

          .f-bottom {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 1.4rem;
            padding-top: 1.6rem;
          }

          .f-nav { flex-wrap: wrap; gap: 0.65rem; }

          .f-left { gap: 0.65rem; align-items: center; }
        }

      `}</style>

      <footer>

        {/* ── Tall scroll tunnel (provides scrollable height) ── */}
        <div className="f-tunnel" ref={tunnelRef}>

          {/* ── Sticky viewport ── */}
          <div className="f-sticky" ref={stickyRef}>

            {/* Greyscale canvas (always visible underneath) */}
            <canvas ref={bwCanvasRef} className="f-canvas f-canvas--bw" />

            {/* Colour canvas (clipped from bottom upward) */}
            <canvas
              ref={canvasRef}
              className="f-canvas f-canvas--colour"
              style={{ clipPath: `inset(${waveY}% 0 0 0)` }}
            />

            {/* Gradient overlay */}
            <div className="f-overlay" />

            {/* ── Content layer ── */}
            <div className="f-inner">

              {/* Reveal line — scaleX driven by lineP */}
              <div
                className="f-reveal-line"
                style={{ transform: `scaleX(${lineP})`, transition: 'none' }}
              />

              {/* Spacer — pushes content to lower portion */}
              <div style={{ flex: 1 }} />

              {/* ── Headline ── */}
              <div className="f-title" style={headStyle}>
                <h5 className="f-h5">
                  Let&rsquo;s make something
                  <br />
                  that moves people.
                  <br />
                  <a href="mailto:hello@byraven.com" className="f-mailto">
                    hello@byraven.com
                  </a>
                </h5>
              </div>

              {/* ── 4-column grid ── */}
              <div className="f-grid" style={gridStyle}>

                {/* (a.) Contact */}
                <div className="f-col">
                  <div className="f-eyebrow">
                    <span className="f-alpha">(a.)</span> Contact
                  </div>
                  <p className="f-body">
                    hello@byraven.com<br />
                    The Netherlands
                  </p>
                  <div className="f-links">
                    <a href="mailto:hello@byraven.com" className="f-ulink">
                      Send an email
                    </a>
                  </div>
                </div>

                {/* (b.) Services */}
                <div className="f-col">
                  <div className="f-eyebrow">
                    <span className="f-alpha">(b.)</span> Services
                  </div>
                  <div className="f-links">
                    {[
                      'Original Music',
                      'Music Production',
                      'Sonic Branding',
                      'Sound Design',
                      'Post Production',
                    ].map(s => (
                      <span key={s} className="f-ulink" style={{ cursor: 'default' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* (c.) Newsletter */}
                <div className="f-col">
                  <div className="f-eyebrow">
                    <span className="f-alpha">(c.)</span> Newsletter
                  </div>
                  <p className="f-body">
                    Stay updated on our latest work.<br />
                    No spam — only music.
                  </p>
                  {formStatus === 'success' ? (
                    <p className="f-success">
                      Thank you! You&rsquo;re subscribed.
                    </p>
                  ) : (
                    <form className="f-form" onSubmit={handleSubmit}>
                      <input
                        type="email"
                        name="email"
                        maxLength={256}
                        placeholder="enter your email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="f-input"
                      />
                      <button type="submit" className="f-btn">JOIN</button>
                    </form>
                  )}
                </div>

                {/* (d.) Follow */}
                <div className="f-col">
                  <div className="f-eyebrow">
                    <span className="f-alpha">(d.)</span> Follow
                  </div>
                  <div className="f-links">
                    {socialLinks.map(s => (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="f-ulink"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>

              </div>{/* /f-grid */}

              {/* ── Bottom bar ── */}
              <div className="f-bottom" style={botStyle}>

                <nav className="f-nav">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="f-nav-link">
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="f-left">
                  <svg
                    className="f-logo-icon"
                    viewBox="0 0 998 779"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z"
                      stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path
                      d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z"
                      stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path
                      d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z"
                      stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  <span className="f-rights">© by raven — all rights reserved</span>
                </div>

              </div>{/* /f-bottom */}

            </div>{/* /f-inner */}

          </div>{/* /f-sticky */}

        </div>{/* /f-tunnel */}

      </footer>
    </>
  )
}