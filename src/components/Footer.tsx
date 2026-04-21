'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'

// ─── CONFIG ────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 80

// Total tunnel height = PHASES × 100vh
// Phase 0: 0.00 → 0.50  →  frames 1 → 80  (scroll DOWN)
// Phase 1: 0.50 → 1.00  →  frames 80 → 1  (scroll UP reverse)
// UI overlays appear only during phase 1 (50 % → 100 %)
const TUNNEL_VH = 1600          // 16 × 100vh = very deliberate, cinematic
// ───────────────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(3, '0') }

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

interface AnimState {
  colorP: number
  lineP: number
  headP: number
  gridP: number
  botP: number
}
const INIT_ANIM: AnimState = { colorP: 0, lineP: 0, headP: 0, gridP: 0, botP: 0 }

function ease(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
function seg(raw: number, lo: number, hi: number) {
  return ease(Math.min(Math.max((raw - lo) / (hi - lo), 0), 1))
}

export default function Footer() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const bwRef      = useRef<HTMLCanvasElement>(null)
  const imagesRef  = useRef<HTMLImageElement[]>([])
  const frameRef   = useRef(0)
  const rafRef     = useRef<number | null>(null)

  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle')
  const [email,      setEmail]      = useState('')
  const [anim,       setAnim]       = useState<AnimState>(INIT_ANIM)

  // ── Draw frame ────────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const col = canvasRef.current; const bw = bwRef.current
    if (!col || !bw) return
    const colCtx = col.getContext('2d'); const bwCtx = bw.getContext('2d')
    if (!colCtx || !bwCtx) return
    const img = imagesRef.current[index]
    if (!img?.complete || !img.naturalWidth) return

    const cw = col.width, ch = col.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale
    const sx = (cw - sw) / 2,           sy = (ch - sh) / 2

    colCtx.clearRect(0, 0, cw, ch); colCtx.drawImage(img, sx, sy, sw, sh)
    bwCtx.clearRect(0, 0, cw, ch);  bwCtx.drawImage(img, sx, sy, sw, sh)
  }, [])

  // ── Preload ───────────────────────────────────────────────────────────────
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

  // ── Scroll → frame + anim ─────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      const wrap = wrapRef.current
      if (!wrap) return

      const rect      = wrap.getBoundingClientRect()
      const vh        = window.innerHeight
      const scrollable = wrap.offsetHeight - vh
      const scrolled  = Math.min(Math.max(-rect.top, 0), scrollable)
      const raw       = scrollable > 0 ? scrolled / scrollable : 0   // 0 → 1

      // ── Tell the Navbar to hide/show itself ───────────────────────────────
      // raw > 0 means we're inside the footer zone
      window.dispatchEvent(new CustomEvent('footer-active', { detail: { active: raw > 0.01 } }))

      // ── Ping-pong image sequence ──────────────────────────────────────────
      // First half  (raw 0 → 0.5): frames 0 → 79  (1 → 80, forward)
      // Second half (raw 0.5 → 1): frames 79 → 0  (80 → 1, reverse)
      let frameIdx: number
      if (raw <= 0.5) {
        // Forward pass: 0→79
        frameIdx = Math.round((raw / 0.5) * (TOTAL_FRAMES - 1))
      } else {
        // Reverse pass: 79→0
        frameIdx = Math.round(((1 - raw) / 0.5) * (TOTAL_FRAMES - 1))
      }
      frameIdx = Math.min(Math.max(frameIdx, 0), TOTAL_FRAMES - 1)

      if (frameIdx !== frameRef.current) {
        frameRef.current = frameIdx
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIdx))
      }

      // ── Colour wash + UI overlays (appear in second half) ─────────────────
      // Map second half (0.5 → 1.0) to local progress 0 → 1
      const uiRaw = seg(raw, 0.50, 1.00)   // 0 in first half, 0→1 in second half
      setAnim({
        colorP: seg(raw, 0.42, 0.72),       // colour wash starts near the flip
        lineP:  seg(uiRaw, 0.05, 0.28),
        headP:  seg(uiRaw, 0.12, 0.36),
        gridP:  seg(uiRaw, 0.28, 0.52),
        botP:   seg(uiRaw, 0.44, 0.68),
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      // Make sure navbar is shown when footer unmounts
      window.dispatchEvent(new CustomEvent('footer-active', { detail: { active: false } }))
    }
  }, [drawFrame])

  // ── Resize canvases ───────────────────────────────────────────────────────
  useEffect(() => {
    function resize() {
      const s = stickyRef.current; if (!s) return
      const w = s.clientWidth, h = s.clientHeight
      ;[canvasRef.current, bwRef.current].forEach(c => {
        if (!c) return; c.width = w; c.height = h
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

  const { colorP, lineP, headP, gridP, botP } = anim
  const waveY = Math.round((1 - colorP) * 100)

  const headStyle: React.CSSProperties = { opacity: headP, transform: `translateY(${(1 - headP) * 36}px)`, transition: 'none' }
  const gridStyle: React.CSSProperties = { opacity: gridP, transform: `translateY(${(1 - gridP) * 24}px)`, transition: 'none' }
  const botStyle:  React.CSSProperties = { opacity: botP,  transform: `translateY(${(1 - botP)  * 18}px)`, transition: 'none' }

  return (
    <>
      <style>{`
        /* ── Tall scroll tunnel ── */
        .seq-wrap {
          position: relative;
          width: 100%;
          height: ${TUNNEL_VH}vh;
        }

        /* ── Sticky cinematic viewport ── */
        .seq-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        /* ── Canvas layers ── */
        .seq-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .seq-canvas--bw     { z-index: 1; filter: grayscale(1) brightness(0.5); }
        .seq-canvas--colour { z-index: 2; }

        /* ── Gradient overlay ── */
        .seq-overlay {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.05) 30%,
            rgba(0,0,0,0.55) 68%,
            rgba(0,0,0,0.97) 100%
          );
        }

        /* ── Content container ── */
        .seq-inner {
          position: absolute; inset: 0; z-index: 4;
          display: flex; flex-direction: column;
          padding: clamp(2rem,5vw,4rem) clamp(2rem,6vw,5rem) clamp(1.8rem,4vw,3rem);
          pointer-events: none; overflow: hidden;
        }

        /* ── Reveal line ── */
        .f-reveal-line {
          flex-shrink: 0; height: 1px;
          background: linear-gradient(to right, var(--accent,#c8a96e) 0%, rgba(200,169,110,0.08) 100%);
          transform-origin: left center;
          margin-bottom: clamp(1rem,2.5vh,2.5rem);
        }

        /* ── Headline ── */
        .f-title { margin-top: auto; margin-bottom: clamp(1.5rem,4vh,3.5rem); pointer-events: all; }
        .f-h5 {
          font-family: var(--font-display,'Cormorant Garamond',serif);
          font-size: clamp(2.4rem,6vw,6.5rem); font-weight: 300;
          line-height: 1.05; letter-spacing: -0.015em;
          color: var(--light,#f0ede6);
        }
        .f-mailto {
          display: inline-block; margin-top: 0.6rem;
          font-family: var(--font-sans,'Roboto',sans-serif);
          font-size: clamp(0.75rem,1.6vw,1.2rem); font-weight: 400; letter-spacing: 0.05em;
          color: var(--accent,#c8a96e); text-decoration: none;
          border-bottom: 1px solid rgba(200,169,110,0.25); padding-bottom: 0.1rem;
          transition: color .3s, border-color .3s;
        }
        .f-mailto:hover { color: var(--accent-light,#e8c98e); border-color: var(--accent,#c8a96e); }

        /* ── 4-col grid ── */
        .f-grid {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: clamp(1rem,3vw,3.5rem);
          border-top: 1px solid rgba(240,237,230,0.1);
          padding-top: clamp(1.2rem,2.5vh,2rem);
          margin-bottom: clamp(1.2rem,2.5vh,2.5rem);
          pointer-events: all; flex-shrink: 0;
        }
        .f-col { display: flex; flex-direction: column; gap: .5rem; }
        .f-eyebrow {
          display: flex; gap: .35rem; align-items: baseline;
          font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .55rem; letter-spacing: .28em; text-transform: uppercase;
          color: rgba(240,237,230,.35); margin-bottom: .5rem;
        }
        .f-alpha {
          font-family: var(--font-display,'Cormorant Garamond',serif);
          font-style: italic; font-size: .8rem; font-weight: 300;
          color: var(--accent,#c8a96e);
        }
        .f-body {
          font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .62rem; line-height: 2; color: rgba(240,237,230,.45); margin-bottom: .4rem;
        }
        .f-links { display: flex; flex-direction: column; gap: .35rem; }
        .f-ulink {
          font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .62rem; letter-spacing: .04em; color: rgba(240,237,230,.65);
          text-decoration: none; width: fit-content;
          transition: color .25s; position: relative;
        }
        .f-ulink::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 100%; height: 1px; background: currentColor;
          transform: scaleX(0); transform-origin: right;
          transition: transform .45s cubic-bezier(.65,0,.35,1);
        }
        a.f-ulink:hover { color: var(--accent,#c8a96e); }
        a.f-ulink:hover::after { transform: scaleX(1); transform-origin: left; }

        /* ── Newsletter ── */
        .f-form { display: flex; margin-top: .4rem; }
        .f-input {
          flex: 1; min-width: 0; background: rgba(255,255,255,.03);
          border: 1px solid rgba(240,237,230,.1); border-right: none;
          color: var(--light,#f0ede6); font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .6rem; padding: .55rem .8rem; outline: none;
          transition: border-color .3s, background .3s;
        }
        .f-input::placeholder { color: rgba(240,237,230,.22); }
        .f-input:focus { border-color: rgba(200,169,110,.4); background: rgba(255,255,255,.06); }
        .f-btn {
          background: var(--accent,#c8a96e); border: 1px solid var(--accent,#c8a96e);
          color: #000; font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .55rem; font-weight: 700; letter-spacing: .2em;
          padding: .55rem 1.1rem; cursor: pointer; transition: background .3s, border-color .3s;
        }
        .f-btn:hover { background: var(--accent-light,#e8c98e); border-color: var(--accent-light,#e8c98e); }

        /* ── Bottom bar ── */
        .f-bottom {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(240,237,230,.1); padding-top: 1.2rem;
          flex-wrap: wrap; gap: 1rem; pointer-events: all; flex-shrink: 0;
        }
        .f-nav { display: flex; gap: 1.8rem; }
        .f-nav-link {
          font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .55rem; letter-spacing: .22em; text-transform: uppercase;
          color: rgba(240,237,230,.35); text-decoration: none; transition: color .3s;
        }
        .f-nav-link:hover { color: var(--light,#f0ede6); }
        .f-left { display: flex; align-items: center; gap: .8rem; }
        .f-logo-icon { width: 22px; height: 18px; color: rgba(240,237,230,.4); transition: color .3s; }
        .f-logo-icon:hover { color: var(--accent,#c8a96e); }
        .f-rights {
          font-family: var(--font-sans,'Roboto',sans-serif);
          font-size: .48rem; letter-spacing: .16em; text-transform: uppercase;
          color: rgba(240,237,230,.25);
        }

        /* ── Scroll indicator (shows while images are playing) ── */
        .f-scroll-hint {
          position: absolute; bottom: 2.4rem; left: 50%; transform: translateX(-50%);
          z-index: 5; display: flex; flex-direction: column; align-items: center; gap: .5rem;
          pointer-events: none; transition: opacity .6s ease;
        }
        .f-scroll-hint span {
          font-family: var(--font-mono,'Space Mono',monospace);
          font-size: .45rem; letter-spacing: .3em; text-transform: uppercase;
          color: rgba(240,237,230,.3);
        }
        .f-scroll-cue-line {
          width: 1px; height: 40px; background: rgba(240,237,230,.15); position: relative; overflow: hidden;
        }
        .f-scroll-cue-line::after {
          content: ''; position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%; background: rgba(200,169,110,.6);
          animation: fScrollDrop 1.6s ease-in-out infinite;
        }
        @keyframes fScrollDrop {
          0%   { top: -100%; }
          50%  { top: 100%; }
          100% { top: 100%; }
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .f-grid { grid-template-columns: repeat(2,1fr); gap: 2rem; }
        }
        @media (max-width: 600px) {
          .seq-wrap { height: ${Math.round(TUNNEL_VH * 0.7)}vh; }
          .seq-inner { padding: 3rem 7% 2rem; }
          .f-h5 { font-size: 1.85rem !important; line-height: 1.14 !important; }
          .f-grid { grid-template-columns: 1fr; gap: 1.8rem; }
          .f-title { margin-top: 0; margin-bottom: .8rem; }
          .f-bottom { flex-direction: column-reverse; align-items: flex-start; gap: 1.8rem; padding-top: 2rem; }
          .f-nav { flex-wrap: wrap; gap: 1rem; }
        }
      `}</style>

      <footer>
        <div className="seq-wrap" ref={wrapRef}>
          <div className="seq-sticky" ref={stickyRef}>

            {/* BW base layer */}
            <canvas ref={bwRef} className="seq-canvas seq-canvas--bw" />

            {/* Colour layer — clips in from bottom */}
            <canvas
              ref={canvasRef}
              className="seq-canvas seq-canvas--colour"
              style={{ clipPath: `inset(${waveY}% 0 0 0)` }}
            />

            <div className="seq-overlay" />

            {/* Scroll hint — visible while images are animating */}
            <div
              className="f-scroll-hint"
              style={{ opacity: anim.headP > 0.05 ? 0 : 1 }}
            >
              <div className="f-scroll-cue-line" />
              <span>scroll</span>
            </div>

            {/* Footer content */}
            <div className="seq-inner">
              <div
                className="f-reveal-line"
                style={{ transform: `scaleX(${lineP})`, transition: 'none' }}
              />
              <div style={{ flex: 1 }} />

              {/* Headline */}
              <div className="f-title" style={headStyle}>
                <h5 className="f-h5">
                  Let&rsquo;s make something<br />
                  that moves people.<br />
                  <a href="mailto:hello@byraven.com" className="f-mailto">
                    hello@byraven.com
                  </a>
                </h5>
              </div>

              {/* 4-col grid */}
              <div className="f-grid" style={gridStyle}>
                <div className="f-col">
                  <div className="f-eyebrow"><span className="f-alpha">(a.)</span> Contact</div>
                  <p className="f-body">hello@byraven.com<br />The Netherlands</p>
                  <div className="f-links">
                    <a href="mailto:hello@byraven.com" className="f-ulink">Send an email</a>
                  </div>
                </div>

                <div className="f-col">
                  <div className="f-eyebrow"><span className="f-alpha">(b.)</span> Services</div>
                  <div className="f-links">
                    {['Original Music','Music Production','Sonic Branding','Sound Design','Post Production'].map(s => (
                      <span key={s} className="f-ulink" style={{ cursor: 'default' }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="f-col">
                  <div className="f-eyebrow"><span className="f-alpha">(c.)</span> Newsletter</div>
                  <p className="f-body">Stay updated on our latest work.<br />No spam.</p>
                  {formStatus === 'success' ? (
                    <p className="f-body" style={{ color: 'var(--accent,#c8a96e)' }}>
                      Thank you! You&rsquo;re subscribed.
                    </p>
                  ) : (
                    <form className="f-form" onSubmit={handleSubmit}>
                      <input
                        type="email" placeholder="enter your email" required
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="f-input"
                      />
                      <button type="submit" className="f-btn">JOIN</button>
                    </form>
                  )}
                </div>

                <div className="f-col">
                  <div className="f-eyebrow"><span className="f-alpha">(d.)</span> Follow</div>
                  <div className="f-links">
                    {socialLinks.map(s => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="f-ulink">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="f-bottom" style={botStyle}>
                <nav className="f-nav">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="f-nav-link">{link.label}</Link>
                  ))}
                </nav>
                <div className="f-left">
                  <svg className="f-logo-icon" viewBox="0 0 998 779" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="f-rights">© by raven — all rights reserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}