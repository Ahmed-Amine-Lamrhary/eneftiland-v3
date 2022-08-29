import React, { useContext } from "react"
import PageContext from "../context/PageContext"
import AppModal from "./AppModal"
import metamaskIcon from "../assets/icons/metamask.png"
import Image from "next/image"
import Button from "./Button"

function isMobileDevice() {
  return "ontouchstart" in window || "onmsgesturechange" in window
}

export default function ConnectWallet() {
  const { showAuthModal, setShowAuthModal, connectBrowser } =
    useContext(PageContext)

  return (
    <AppModal
      show={showAuthModal}
      onHide={() => setShowAuthModal(false)}
      size="sm"
      title="Connect a Wallet"
    >
      <ConnectBtn connectBrowser={connectBrowser} />

      <hr />

      <div className="text-center">
        <h6 className="mb-3 fw-bold">Don't have a wallet?</h6>
        <Button
          target="_blank"
          className="btn-sm"
          to="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
        >
          Get a Wallet
        </Button>
      </div>
    </AppModal>
  )
}

function ConnectBtn({ connectBrowser }: any) {
  if (isMobileDevice()) {
    const dappUrl = "eneftiland-v3.herokuapp.com"
    const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl

    return (
      <a className="login-btn" href={metamaskAppDeepLink}>
        <button>
          <span className="me-3">
            <Image src={metamaskIcon} width={22} height={22} />
          </span>{" "}
          Connect wallet
        </button>
      </a>
    )
  }

  return (
    <button className="login-btn" onClick={connectBrowser}>
      <span className="me-3">
        <Image src={metamaskIcon} width={22} height={22} />
      </span>
      Connect wallet
    </button>
  )
}
