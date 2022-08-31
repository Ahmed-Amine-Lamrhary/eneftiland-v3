import React, { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { injected } from "./connectors"

function WalletAuthProvider({ children }: any) {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React()

  useEffect(() => {
    handle()
  }, [activateNetwork, networkActive, networkError])

  const handle = async () => {
    try {
      const isAuthorized = await injected.isAuthorized()

      if (isAuthorized && !networkActive && !networkError) {
        activateNetwork(injected)
      }
    } catch (error) {}
  }

  return children
}

export default WalletAuthProvider
