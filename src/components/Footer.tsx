'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 80
// ────────────────────────────────────────────────────────────────────────────

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
  { href: 'https://www.instagram.com/byraven/', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/byraven/', label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@byRaven', label: 'YouTube' },
]

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function seg(raw: number, lo: number, hi: number): number {
  return ease(Math.min(Math.max((raw - lo) / (hi - lo), 0), 1))
}

interface AnimState {
  lineP: number
  headP: number
  gridP: number
  botP: number
}
const INIT_ANIM: AnimState = { lineP: 0, headP: 0, gridP: 0, botP: 0 }

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bwCanvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle')
  const [email, setEmail] = useState('')
  const [anim, setAnim] = useState<AnimState>(INIT_ANIM)
  const [colorP, setColorP] = useState(0)

  // ── Draw a single frame on both canvases ────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const col = canvasRef.current
    const bw = bwCanvasRef.current
    if (!col || !bw) return
    const colCtx = col.getContext('2d')
    const bwCtx = bw.getContext('2d')
    if (!colCtx || !bwCtx) return
    const img = imagesRef.current[index]
    if (!img?.complete) return

    const cw = col.width, ch = col.height
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

  // ── Preload all frames ───────────────────────────────────────────────────
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

  // ── Scroll → frame index + UI reveals ───────────────────────────────────
  useEffect(() => {
    function onScroll() {
      const footer = footerRef.current
      if (!footer) return

      const rect = footer.getBoundingClientRect()
      const wh = window.innerHeight
      const fh = footer.offsetHeight

      // raw = 0  →  footer top just enters viewport from bottom
      // raw = 1  →  footer bottom has scrolled fully past viewport top
      const total = wh + fh
      const gone = wh - rect.top
      const raw = Math.min(Math.max(gone / total, 0), 1)

      // Frames advance over first 65% of the scroll window
      const imgRaw = Math.min(raw / 0.65, 1)
      const target = Math.min(Math.round(imgRaw * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)

      if (target !== frameRef.current) {
        frameRef.current = target
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => drawFrame(target))
      }

      // Colour wash follows frame progress
      setColorP(seg(raw, 0.0, 0.6))

      // UI elements stagger in during the middle portion
      setAnim({
        lineP: seg(raw, 0.28, 0.48),
        headP: seg(raw, 0.36, 0.56),
        gridP: seg(raw, 0.44, 0.64),
        botP: seg(raw, 0.52, 0.70),
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [drawFrame])

  // ── Resize canvases whenever footer dimensions change ────────────────────
  useEffect(() => {
    function resize() {
      const footer = footerRef.current
      if (!footer) return
      const w = footer.clientWidth
      const h = footer.clientHeight
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

  const { lineP, headP, gridP, botP } = anim

  // Colour canvas clips in from the bottom — driven purely by scroll
  const clipTop = Math.round((1 - colorP) * 100)

  const headStyle: React.CSSProperties = {
    transform: `translateY(${(1 - headP) * 32}px)`,
    opacity: headP,
    transition: 'none',
  }
  const gridStyle: React.CSSProperties = {
    transform: `translateY(${(1 - gridP) * 20}px)`,
    transition: 'none',
  }
  const botStyle: React.CSSProperties = {
    transform: `translateY(${(1 - botP) * 14}px)`,
    transition: 'none',
  }

  return (
    <>
      <style>{`
        /* ── Footer root — normal flow, no sticky wrapper ────────────── */
        .ft-root {
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          background: #0a0a0a;
        }

        /* ── Canvases ────────────────────────────────────────────────── */
        .ft-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
        }
        .ft-canvas--bw {
          z-index: 1;
          filter: grayscale(1) brightness(0.46);
        }
        .ft-canvas--colour {
          z-index: 2;
        }

        /* ── Dark gradient scrim ─────────────────────────────────────── */
        .ft-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.04) 28%,
            rgba(0,0,0,0.55) 65%,
            rgba(0,0,0,0.97) 100%
          );
          pointer-events: none;
        }

        /* ── Content layer ───────────────────────────────────────────── */
        .ft-inner {
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          min-height: 100svh;
          padding: clamp(2rem, 5vw, 4rem) clamp(2rem, 6vw, 5rem) clamp(1.8rem, 4vw, 3rem);
          pointer-events: none;
        }

        /* ── Reveal line ─────────────────────────────────────────────── */
        .ft-line {
          flex-shrink: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            #c8a96e 0%,
            rgba(200, 169, 110, 0.05) 100%
          );
          transform-origin: left center;
          margin-bottom: clamp(1rem, 2vw, 2.5rem);
        }

        .ft-spacer { flex: 1; }

        /* ── Headline ────────────────────────────────────────────────── */
        .ft-title {
          margin-bottom: clamp(1.5rem, 3vw, 3.5rem);
          pointer-events: all;
        }
        .ft-h5 {
          font-family: 'PP Editorial New', 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.2rem, 5.6vw, 6rem);
          font-weight: 300;
          line-height: 1.06;
          letter-spacing: -0.015em;
          color: #f0ede6;
          margin: 0;
        }
        .ft-mailto {
          display: inline-block;
          margin-top: 0.65rem;
          font-family: 'Geist Mono', 'JetBrains Mono', monospace;
          font-size: clamp(0.72rem, 1.4vw, 1.1rem);
          font-weight: 400;
          letter-spacing: 0.055em;
          color: #c8a96e;
          text-decoration: none;
          border-bottom: 1px solid rgba(200, 169, 110, 0.28);
          padding-bottom: 0.1rem;
          transition: color 0.3s, border-color 0.3s;
        }
        .ft-mailto:hover {
          color: #dfc28e;
          border-color: #c8a96e;
        }

        /* ── 4-column info grid ──────────────────────────────────────── */
        .ft-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(1rem, 3vw, 3.5rem);
          border-top: 1px solid rgba(240, 237, 230, 0.1);
          padding-top: clamp(1.2rem, 2vw, 2rem);
          margin-bottom: clamp(1.2rem, 2vw, 2.5rem);
          pointer-events: all;
          flex-shrink: 0;
        }
        .ft-col {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .ft-eyebrow {
          display: flex;
          gap: 0.35rem;
          align-items: baseline;
          font-family: 'Geist Mono', monospace;
          font-size: 0.54rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(240, 237, 230, 0.28);
          margin-bottom: 0.5rem;
        }
        .ft-alpha {
          font-family: 'PP Editorial New', Georgia, serif;
          font-style: italic;
          font-size: 0.82rem;
          font-weight: 300;
          color: #c8a96e;
        }
        .ft-body {
          font-family: 'Geist Mono', monospace;
          font-size: 0.61rem;
          line-height: 2;
          color: rgba(240, 237, 230, 0.4);
          margin-bottom: 0.3rem;
        }
        .ft-links {
          display: flex;
          flex-direction: column;
          gap: 0.32rem;
        }
        .ft-ulink {
          font-family: 'Geist Mono', monospace;
          font-size: 0.61rem;
          letter-spacing: 0.04em;
          color: rgba(240, 237, 230, 0.6);
          text-decoration: none;
          width: fit-content;
          position: relative;
          transition: color 0.25s;
        }
        .ft-ulink::after {
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
        a.ft-ulink:hover { color: #c8a96e; }
        a.ft-ulink:hover::after { transform: scaleX(1); transform-origin: left; }

        /* Newsletter form */
        .ft-form { display: flex; margin-top: 0.4rem; }
        .ft-input {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(240, 237, 230, 0.1);
          border-right: none;
          color: #f0ede6;
          font-family: 'Geist Mono', monospace;
          font-size: 0.6rem;
          padding: 0.55rem 0.8rem;
          outline: none;
          transition: border-color 0.3s, background 0.3s;
        }
        .ft-input::placeholder { color: rgba(240, 237, 230, 0.22); }
        .ft-input:focus {
          border-color: rgba(200, 169, 110, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }
        .ft-btn {
          background: #c8a96e;
          border: 1px solid #c8a96e;
          color: #0a0a0a;
          font-family: 'Geist Mono', monospace;
          font-size: 0.54rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          padding: 0.55rem 1.1rem;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s;
        }
        .ft-btn:hover { background: #dfc28e; border-color: #dfc28e; }
        .ft-success {
          font-family: 'Geist Mono', monospace;
          font-size: 0.61rem;
          color: #c8a96e;
          margin-top: 0.4rem;
        }

        /* ── Bottom bar ──────────────────────────────────────────────── */
        .ft-bottom {
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
        .ft-nav { display: flex; gap: 1.8rem; }
        .ft-nav-link {
          font-family: 'Geist Mono', monospace;
          font-size: 0.54rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(240, 237, 230, 0.3);
          text-decoration: none;
          transition: color 0.3s;
        }
        .ft-nav-link:hover { color: #f0ede6; }
        .ft-right { display: flex; align-items: center; gap: 0.85rem; }
        .ft-logo-icon {
          width: 22px;
          height: 18px;
          color: rgba(240, 237, 230, 0.36);
          transition: color 0.3s;
          flex-shrink: 0;
        }
        .ft-logo-icon:hover { color: #c8a96e; }
        .ft-rights {
          font-family: 'Geist Mono', monospace;
          font-size: 0.47rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240, 237, 230, 0.2);
        }

        /* ── Responsive ──────────────────────────────────────────────── */
        @media (max-width: 1100px) {
          .ft-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        }
        @media (max-width: 640px) {
          .ft-inner { padding: 3rem 7% 2rem; }
          .ft-h5    { font-size: 1.8rem !important; line-height: 1.15 !important; }
          .ft-grid  { grid-template-columns: 1fr; gap: 1.8rem; }
          .ft-title { margin-bottom: 0.8rem; }
          .ft-bottom {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 1.8rem;
            padding-top: 2rem;
          }
          .ft-nav { flex-wrap: wrap; gap: 1rem; }
        }
      `}</style>

      {/*
        The footer is a normal block element in the page flow.
        No sticky wrapper, no extra scroll height.
        The two canvases are absolutely positioned inside it and
        resize to match the footer's natural height.
        Frame index and UI reveals are driven by how far the footer
        has scrolled through the viewport.
      */}
      <footer className="ft-root" ref={footerRef}>

        {/* Grayscale base — always fully drawn */}
        <canvas ref={bwCanvasRef} className="ft-canvas ft-canvas--bw" />

        {/* Colour layer — clips in from the bottom as user scrolls down */}
        <canvas
          ref={canvasRef}
          className="ft-canvas ft-canvas--colour"
          style={{ clipPath: `inset(${clipTop}% 0 0 0)` }}
        />

        {/* Dark gradient scrim */}
        <div className="ft-overlay" />

        {/* All footer content */}
        <div className="ft-inner">

          {/* Horizontal reveal line */}
          <div
            className="ft-line"
            style={{
              transform: `scaleX(${lineP})`,
              opacity: lineP,
              transition: 'none',
            }}
          />

          <div className="ft-spacer" />

          {/* Headline + email */}
          <div className="ft-title" style={headStyle}>
            <h5 className="ft-h5">
              Let&rsquo;s make something<br />
              that moves people.<br />
              <a href="mailto:hello@byraven.com" className="ft-mailto">
                hello@byraven.com
              </a>
            </h5>
          </div>

          {/* 4-column info grid */}
          <div className="ft-grid" style={gridStyle}>

            {/* (a.) Contact */}
            <div className="ft-col">
              <div className="ft-eyebrow">
                <span className="ft-alpha">(a.)</span> Contact
              </div>
              <p className="ft-body">
                hello@byraven.com<br />
                The Netherlands
              </p>
              <div className="ft-links">
                <a href="mailto:hello@byraven.com" className="ft-ulink">
                  Send an email
                </a>
              </div>
            </div>

            {/* (b.) Services */}
            <div className="ft-col">
              <div className="ft-eyebrow">
                <span className="ft-alpha">(b.)</span> Services
              </div>
              <div className="ft-links">
                {[
                  'Original Music',
                  'Music Production',
                  'Sonic Branding',
                  'Sound Design',
                  'Post Production',
                ].map(s => (
                  <span key={s} className="ft-ulink" style={{ cursor: 'default' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* (c.) Newsletter */}
            <div className="ft-col">
              <div className="ft-eyebrow">
                <span className="ft-alpha">(c.)</span> Newsletter
              </div>
              <p className="ft-body">
                Stay updated on our latest work.<br />No spam.
              </p>
              {formStatus === 'success' ? (
                <p className="ft-success">Thank you! You&rsquo;re subscribed.</p>
              ) : (
                <form className="ft-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="enter your email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="ft-input"
                  />
                  <button type="submit" className="ft-btn">JOIN</button>
                </form>
              )}
            </div>

            {/* (d.) Follow */}
            <div className="ft-col">
              <div className="ft-eyebrow">
                <span className="ft-alpha">(d.)</span> Follow
              </div>
              <div className="ft-links">
                {socialLinks.map(s => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-ulink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="ft-bottom" style={botStyle}>
            <nav className="ft-nav">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="ft-nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ft-right">
              <svg
                className="ft-logo-icon"
                viewBox="0 0 998 779"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="by Raven"
              >
                <path
                  d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                  d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <span className="ft-rights">
                &copy; by raven &mdash; all rights reserved
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}