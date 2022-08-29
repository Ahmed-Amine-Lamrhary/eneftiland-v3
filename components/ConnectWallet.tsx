import React, { useContext } from "react"
import PageContext from "../context/PageContext"
import AppModal from "./AppModal"
import metamaskIcon from "../assets/icons/metamask.png"
import coinbaseIcon from "../assets/icons/coinbase.png"
import Image from "next/image"
import Button from "./Button"

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
      <button className="login-btn" onClick={() => connectBrowser("metamask")}>
        <span className="me-2">
          <Image src={metamaskIcon} width={22} height={22} />
        </span>
        Metamask
      </button>

      <button className="login-btn" onClick={() => connectBrowser("coinbase")}>
        <span className="me-2">
          <Image src={coinbaseIcon} width={22} height={22} />
        </span>
        Coinbase Wallet
      </button>

      <div className="mt-4 text-center">
        <h6 className="mb-3 fw-bold">Don't have a wallet?</h6>
        <Button
          target="_blank"
          className="btn-sm btn-outline"
          to="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
        >
          Get a Wallet
        </Button>
      </div>
    </AppModal>
  )
}
