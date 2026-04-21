'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    function onFooterActive(e: Event) {
      const evt = e as CustomEvent<{ active: boolean }>
      setHidden(evt.detail.active)
    }
    window.addEventListener('footer-active', onFooterActive)
    return () => window.removeEventListener('footer-active', onFooterActive)
  }, [])

  return (
    <div
      className="navbar-wrapper glass-nav"
      style={{
        opacity:    hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'all',
        transform:  hidden ? 'translateY(16px)' : 'translateY(0)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <nav className="nav-menu">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${pathname === link.href ? ' active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}