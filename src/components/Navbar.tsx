'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="navbar-wrapper glass-nav">
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