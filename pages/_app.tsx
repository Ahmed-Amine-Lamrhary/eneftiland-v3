import { useEffect } from "react"
import Web3 from "web3"
import { Web3ReactProvider } from "@web3-react/core"

import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/globals.scss"
import "../styles/app.scss"
import "../styles/elements.scss"
import "react-toastify/dist/ReactToastify.css"
import MetamaskProvider from "../helpers/wallet/MetamaskProvider"

function getLibrary(provider: any) {
  return new Web3(provider)
}

function App({ Component, pageProps }: any) {
  const pageLayout = Component.layout || ((page: any) => page)

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap")
  }, [])

  return pageLayout(
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
        <Component {...pageProps} />
      </MetamaskProvider>
    </Web3ReactProvider>
  )
}

export default App
