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

interface AnimState {
  colorP: number
  lineP: number
  headP: number
  gridP: number
  botP: number
}

const INIT_ANIM: AnimState = { colorP: 0, lineP: 0, headP: 0, gridP: 0, botP: 0 }

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

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

  useEffect(() => {
    const imgs: HTMLImageElement[] = []
    let loadedCount = 0
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/images72/ezgif-frame-${pad(i)}.jpg`
      img.onload = () => {
        loadedCount++
        if (i === 1) drawFrame(0)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [drawFrame])

  useEffect(() => {
    function onScroll() {
      const tunnel = tunnelRef.current
      if (!tunnel) return

      const rect = tunnel.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollable = tunnel.offsetHeight - vh
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable)
      const raw = scrollable > 0 ? scrolled / scrollable : 0

      // Image sequence driven by progress
      const target = Math.round(raw * (TOTAL_FRAMES - 1))
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setTimeout(() => setFormStatus('success'), 600)
  }

  const { colorP, lineP, headP, gridP, botP } = anim
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

  return (
    <>
      <style>{`
        .f-tunnel {
          position: relative;
          height: 380vh; /* Adjusted for tighter scroll */
          width: 100%;
          background: #000;
        }

        .f-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--dark);
        }

        .f-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .f-canvas--bw {
          z-index: 1;
          filter: grayscale(1) brightness(0.5);
        }

        .f-canvas--colour {
          z-index: 2;
        }

        .f-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(0,0,0,0.1) 25%,
            rgba(0,0,0,0.6) 70%,
            rgba(0,0,0,0.95) 100%
          );
          pointer-events: none;
        }

        .f-inner {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          padding: clamp(2rem, 5vw, 4rem) clamp(2rem, 6vw, 5rem) clamp(1.8rem, 4vw, 3rem);
          pointer-events: none;
          overflow: hidden;
        }

        .f-reveal-line {
          flex-shrink: 0;
          height: 1px;
          background: linear-gradient(to right, var(--accent) 0%, rgba(200,169,110,0.1) 100%);
          transform-origin: left center;
          margin-bottom: clamp(1rem, 2.5vh, 2.5rem);
        }

        .f-title {
          margin-top: auto;
          margin-bottom: clamp(1.5rem, 4vh, 3.5rem);
          pointer-events: all;
        }

        .f-h5 {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 6vw, 6.5rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.015em;
          color: var(--light);
        }

        .f-mailto {
          display: inline-block;
          margin-top: 0.6rem;
          font-family: var(--font-sans);
          font-size: clamp(0.75rem, 1.6vw, 1.2rem);
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(200,169,110,0.25);
          padding-bottom: 0.1rem;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .f-mailto:hover {
          color: var(--accent-light);
          border-color: var(--accent);
        }

        .f-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1rem, 3vw, 3.5rem);
          border-top: 1px solid rgba(240, 237, 230, 0.1);
          padding-top: clamp(1.2rem, 2.5vh, 2rem);
          margin-bottom: clamp(1.2rem, 2.5vh, 2.5rem);
          pointer-events: all;
          flex-shrink: 0;
        }

        .f-col { display: flex; flex-direction: column; gap: 0.5rem; }

        .f-eyebrow {
          display: flex;
          gap: 0.35rem;
          align-items: baseline;
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(240, 237, 230, 0.35);
          margin-bottom: 0.5rem;
        }

        .f-alpha {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--accent);
        }

        .f-body {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          line-height: 2;
          color: rgba(240, 237, 230, 0.45);
          margin-bottom: 0.4rem;
        }

        .f-links { display: flex; flex-direction: column; gap: 0.35rem; }

        .f-ulink {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.04em;
          color: rgba(240, 237, 230, 0.65);
          text-decoration: none;
          width: fit-content;
          transition: color 0.25s ease;
          position: relative;
        }
        .f-ulink::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
        }
        a.f-ulink:hover { color: var(--accent); }
        a.f-ulink:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .f-form { display: flex; margin-top: 0.4rem; }
        .f-input {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(240, 237, 230, 0.1);
          border-right: none;
          color: var(--light);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          padding: 0.55rem 0.8rem;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .f-input:focus {
          border-color: rgba(200, 169, 110, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }
        .f-btn {
          background: var(--accent);
          border: 1px solid var(--accent);
          color: #000;
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 0.55rem 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .f-btn:hover { background: var(--accent-light); border-color: var(--accent-light); }

        .f-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(240, 237, 230, 0.1);
          padding-top: 1.2rem;
          flex-wrap: wrap;
          gap: 1rem;
          pointer-events: all;
          flex-shrink: 0;
        }

        .f-nav { display: flex; gap: 1.8rem; }
        .f-nav-link {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240, 237, 230, 0.35);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .f-nav-link:hover { color: var(--light); }

        .f-left { display: flex; align-items: center; gap: 0.8rem; }
        .f-logo-icon { width: 22px; height: 18px; color: rgba(240, 237, 230, 0.4); transition: color 0.3s ease; }
        .f-logo-icon:hover { color: var(--accent); }
        .f-rights {
          font-family: var(--font-sans);
          font-size: 0.48rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(240, 237, 230, 0.25);
        }

        @media (max-width: 1100px) {
          .f-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        }
        @media (max-width: 600px) {
          .f-tunnel { height: 350vh; }
          .f-inner { padding: 3rem 7% 2rem; overflow-y: auto; }
          .f-title { margin-top: 0; margin-bottom: 0.8rem; }
          .f-h5 { font-size: 1.85rem !important; line-height: 1.14 !important; }
          .f-grid { grid-template-columns: 1fr; gap: 1.8rem; }
          .f-bottom { flex-direction: column-reverse; align-items: flex-start; gap: 1.8rem; padding-top: 2rem; }
          .f-nav { flex-wrap: wrap; gap: 1rem; }
        }
      `}</style>

      <footer>
        <div className="f-tunnel" ref={tunnelRef}>
          <div className="f-sticky" ref={stickyRef}>
            <canvas ref={bwCanvasRef} className="f-canvas f-canvas--bw" />
            <canvas
              ref={canvasRef}
              className="f-canvas f-canvas--colour"
              style={{ clipPath: `inset(${waveY}% 0 0 0)` }}
            />
            <div className="f-overlay" />

            <div className="f-inner">
              <div
                className="f-reveal-line"
                style={{ transform: `scaleX(${lineP})`, transition: 'none' }}
              />
              <div style={{ flex: 1 }} />

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
                    {['Original Music', 'Music Production', 'Sonic Branding', 'Sound Design', 'Post Production'].map(s => (
                      <span key={s} className="f-ulink" style={{ cursor: 'default' }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="f-col">
                  <div className="f-eyebrow"><span className="f-alpha">(c.)</span> Newsletter</div>
                  <p className="f-body">Stay updated on our latest work.<br />No spam.</p>
                  {formStatus === 'success' ? (
                    <p className="f-success">Thank you! You&rsquo;re subscribed.</p>
                  ) : (
                    <form className="f-form" onSubmit={handleSubmit}>
                      <input
                        type="email"
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

                <div className="f-col">
                  <div className="f-eyebrow"><span className="f-alpha">(d.)</span> Follow</div>
                  <div className="f-links">
                    {socialLinks.map(s => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="f-ulink">{s.label}</a>
                    ))}
                  </div>
                </div>
              </div>

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
