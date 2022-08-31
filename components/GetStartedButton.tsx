import { useSession } from "next-auth/react"
import React, { useContext } from "react"
import PageContext from "../context/PageContext"
import Button from "./Button"

interface GetStartedButtonProps {
  children: any
  className?: string
  theme?: "primary" | "white"
}

const GetStartedButton = ({
  children,
  className,
  theme,
}: GetStartedButtonProps) => {
  const { setShowAuthModal } = useContext(PageContext)
  const { status } = useSession()

  if (status === "authenticated")
    return (
      <Button to="/app" className={className} theme={theme}>
        {children}
      </Button>
    )

  return (
    <Button
      onClick={() => setShowAuthModal(true)}
      className={className}
      theme={theme}
    >
      {children}
    </Button>
  )
}

export default GetStartedButton
