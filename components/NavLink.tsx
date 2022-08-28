import Link from "next/link"
import React from "react"

interface NavLinkProps {
  className?: string
  children: any
  to: string
  onClick?: any
  disabled?: boolean
}

const NavLink = ({
  className,
  children,
  to,
  onClick,
  disabled = false,
}: NavLinkProps) => {
  return (
    <Link href={to}>
      <a
        onClick={onClick}
        className={`${className} ${disabled ? "disabled" : ""}`}
      >
        {children}
      </a>
    </Link>
  )
}

export default NavLink
