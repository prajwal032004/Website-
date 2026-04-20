'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="text-logo-wrapper">
        <div className="header-text-logo">by RAVEN</div>
      </Link>
      <Link href="/" className="header-logo-wrapper">
        <svg
          className="header-logo"
          viewBox="0 0 998 779"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 32, height: 'auto' }}
        >
          <path
            d="M603.412 238.271L546.787 263.32L546.335 263.521L546.529 263.975L581.011 344.64L498.854 747.868L420.767 346.063L446.675 209.838L498.854 190.808L603.412 238.271Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M271.905 354.571L272.768 354.087L159.928 61.7441L402.059 347.097L428.325 475.869L411.417 500.358L411.257 500.591L411.373 500.849L457.426 602.599L489.747 776.827L201.442 476.791L1.96582 3.37891L271.905 354.571Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M796.142 476.793L507.838 776.827L540.127 602.601L586.213 500.849L586.33 500.591L586.169 500.358L569.229 475.869L595.495 347.095L837.657 61.7432L724.818 354.087L725.682 354.571L995.619 3.37891L796.142 476.793Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </header>
  )
}