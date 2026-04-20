'use client'

import Link from 'next/link'

export default function AboutSection() {
  return (
    <section className="about_section u-padding-main">
      <div className="about_text_wrapper reveal">
        <p className="text-body-large is--home">
          by RAVEN is an international music agency crafting bold, cinematic, and award-winning scores. We partner with industry leaders worldwide to shape culture through truly impactful music.
        </p>
        <Link href="/about" className="button_main">
          read more
        </Link>
      </div>
    </section>
  )
}
