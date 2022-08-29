import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { injected } from "./connectors"
import { getConnectedUser } from "../utils"
import AppLoader from "../../components/AppLoader"
import { useRouter } from "next/router"

function WalletAuthProvider({ children }: any) {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React()

  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    handle()
  }, [activateNetwork, networkActive, networkError])

  const handle = async () => {
    try {
      const connectedUser = getConnectedUser()
      const isAuthorized = await injected.isAuthorized()

      if (!connectedUser) return router.push("/")

      if (connectedUser && isAuthorized && !networkActive && !networkError) {
        activateNetwork(injected)
      }
    } catch (error) {
    } finally {
      setLoaded(true)
    }
  }

  if (loaded) {
    return children
  }

  return (
    <div className="loading-panel">
      <AppLoader />
    </div>
  )
}

export default WalletAuthProvider
