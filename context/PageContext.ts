import React from "react"

interface PageContextInterface {
  showAuthModal: boolean
  setShowAuthModal: any
  settings: any
}

const PageContext = React.createContext<PageContextInterface>({
  showAuthModal: false,
  setShowAuthModal: null,
  settings: null,
})

export default PageContext
