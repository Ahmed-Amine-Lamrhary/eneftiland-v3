import { useWeb3React } from "@web3-react/core"
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
  const { account } = useWeb3React()

  if (account)
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
