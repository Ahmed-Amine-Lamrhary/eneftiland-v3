import Link from "next/link"
import React from "react"

interface NavLinkProps {
  className?: string
  children: any
  to: string
  onClick?: any
}

const NavLink = ({ className, children, to, onClick }: NavLinkProps) => {
  return (
    <Link href={to}>
      <a onClick={onClick} className={className}>
        {children}
      </a>
    </Link>
  )
}

export default NavLink
