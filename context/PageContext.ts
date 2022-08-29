import React from "react"

interface PageContextInterface {
  showAuthModal: boolean
  setShowAuthModal: any
  settings: any
  connectBrowser: any
}

const PageContext = React.createContext<PageContextInterface>({
  showAuthModal: false,
  setShowAuthModal: null,
  settings: null,
  connectBrowser: null,
})

export default PageContext
