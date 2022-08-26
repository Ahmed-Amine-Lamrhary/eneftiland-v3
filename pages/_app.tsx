import { useEffect } from "react"
import { Web3ReactProvider } from "@web3-react/core"

import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/globals.scss"
import "../styles/app.scss"
import "../styles/elements.scss"
import "react-toastify/dist/ReactToastify.css"
import MetamaskProvider from "../helpers/wallet/MetamaskProvider"
import { ethers } from "ethers"

declare const window: any

const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 8000
  return library
}

function App({ Component, pageProps }: any) {
  const pageLayout = Component.layout || ((page: any) => page)

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap")
  }, [])

  // crisp
  useEffect(() => {
    window.$crisp = []
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID
    ;(function () {
      var d = document
      var s: any = d.createElement("script")

      s.src = "https://client.crisp.chat/l.js"
      s.async = 1
      d.getElementsByTagName("head")[0].appendChild(s)
    })()
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
