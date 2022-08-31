import React, { useContext } from "react"
import PageContext from "../context/PageContext"
import AppModal from "./AppModal"
import { signIn } from "next-auth/react"
import GoogleIcon from "../assets/icons/google.png"
import GithubIcon from "../assets/icons/github.png"
import DiscordIcon from "../assets/icons/discord.png"
import Image from "next/image"

export default function LoginModal() {
  const { showAuthModal, setShowAuthModal } = useContext(PageContext)

  return (
    <AppModal
      show={showAuthModal}
      onHide={() => setShowAuthModal(false)}
      size="sm"
      title="Ready to start ?"
    >
      <div className="mt-3">
        <button className="login-btn" onClick={() => signIn("google")}>
          <span className="me-2">
            <Image src={GoogleIcon} width={22} height={22} />
          </span>
          Login with Google
        </button>

        <button className="login-btn" onClick={() => signIn("github")}>
          <span className="me-2">
            <Image src={GithubIcon} width={22} height={22} />
          </span>
          Login with Github
        </button>

        {/* <button className="login-btn" onClick={() => signIn("discord")}>
        <span className="me-2">
          <Image src={DiscordIcon} width={22} height={22} />
        </span>
        Login with Discord
      </button> */}
      </div>
    </AppModal>
  )
}
