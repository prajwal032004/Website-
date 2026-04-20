'use client'

import AwardsSection from '@/components/AwardsSection'
import Footer from '@/components/Footer'
import { useScrollReveal, useParallax } from '@/hooks/useScrollReveal'

const teamMembers = [
  {
    name: 'Sander Moes',
    role: 'Music Composer / Sound Designer',
    imageUrl: 'https://cdn.prod.website-files.com/681dfd1a06c7a786f5707c6a/688cca792b72b6ba163d7819_Sander%20V1.avif',
    alt: 'Portrait of Sander',
  },
  {
    name: 'Justin Welgraven',
    role: 'Founder / Creative Director / Music Composer',
    imageUrl: 'https://cdn.prod.website-files.com/681dfd1a06c7a786f5707c6a/688cca792740aab06bb26716_Justin%20v1.avif',
    alt: 'Portrait of Justin',
  },
  {
    name: 'Wouter van den boogaard',
    role: 'Creative Director / Music Composer',
    imageUrl: 'https://cdn.prod.website-files.com/681dfd1a06c7a786f5707c6a/688cca79a91c3db15067efd7_Wouter%20V1.avif',
    alt: 'Portrait of Wouter',
  },
  {
    name: 'Wilfred Geerts',
    role: 'Music Composer / Sound Designer',
    imageUrl: 'https://cdn.prod.website-files.com/681dfd1a06c7a786f5707c6a/688cca79ecfe190b3585d7f6_Wilfred%20V1.avif',
    alt: 'Portrait of Wilfred',
  },
  {
    name: 'Arjan Terpstra',
    role: 'Music Composer / Sound Designer',
    imageUrl: 'https://cdn.prod.website-files.com/681dfd1a06c7a786f5707c6a/68a46b02fb729badfde85579_Arjan%20V2.jpg',
    alt: 'Portrait of Arjan',
  },
]

export default function AboutPage() {
  useScrollReveal({ threshold: 0.1 })
  useParallax()

  return (
    <div>
      {/* ── About Hero ── */}
      <section className="about-hero-section">
        <div className="about-hero-text">
          <span className="about-hero-text-inner">big sound</span>
        </div>
        <div className="about-hero-text right">
          <span className="about-hero-text-inner">small team</span>
        </div>
        <div className="about-hero-text">
          <span className="about-hero-text-inner">zero drama</span>
        </div>
      </section>

      {/* ── Decorative strip ── */}
      <div style={{
        width: '100%',
        height: '50vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #161616 50%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle raven watermark */}
        <svg
          viewBox="0 0 998 779"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="parallax"
          data-speed="0.2"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(200px, 40vw, 500px)',
            opacity: 0.04,
          }}
        >
          <path d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── About Body ── */}
      <div className="about-info-section">
        <p className="text-body-large reveal">
          by RAVEN is an international music agency with a focus on bold, cinematic
          sound. Our dedicated team of composers turn ideas into award-winning scores.
          With years of experience, a fast-paced workflow, and a solid network of
          musicians we&apos;re here to make some serious noise.
        </p>
        <p className="text-body-large reveal" style={{ marginTop: '2rem', transitionDelay: '0.15s' }}>
          Based in The Netherlands but with a worldwide mindset, we&apos;ve partnered
          with some of the biggest names in the industry, helping shape culture through
          music and sound.
        </p>
      </div>

      {/* ── Services Text ── */}
      <div className="about-services-section">
        <div className="services-list-text reveal-left">
          Online / TV / Radio /<br />
          Commercials / Trailers / Games / Cinema / Sonic Branding /<br />
          Global Campaigns /<br />
          Disruptive Socials / Events
        </div>
        <svg
          viewBox="0 0 998 779"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="reveal-right svg-draw"
          style={{
            width: 'clamp(100px, 18vw, 200px)',
            opacity: 0.2,
            flexShrink: 0,
          }}
        >
          <path d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Team ── */}
      <section className="team-section">
        <h2 className="team-title reveal">the team</h2>
        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <div
              key={member.name}
              className="team-member reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="team-member-img"
                src={member.imageUrl}
                alt={member.alt}
                loading="lazy"
              />
              <div className="team-member-details glass-dark">
                <div className="team-member-name">{member.name}</div>
                <div className="team-member-role">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Awards ── */}
      <AwardsSection />

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}