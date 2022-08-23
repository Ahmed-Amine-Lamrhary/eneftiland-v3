import React, { useEffect, useState } from "react"
import Head from "next/head"
import Footer from "./Footer"
import { ToastContainer, Zoom } from "react-toastify"
import Header from "./Header"
import Script from "next/script"
import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { injected } from "../helpers/wallet/connectors"
import {
  getConnectedUser,
  saveConnectedUser,
  showToast,
} from "../helpers/utils"
import AppModal from "./AppModal"
import axios from "axios"
import Image from "next/image"
import metamaskIcon from "../assets/icons/metamask.png"
import Button from "./Button"
import PageContext from "../context/PageContext"

interface PageProps {
  title: string
  children?: any
  settings: any
  hideNavbar?: boolean
  isProtected?: boolean
}

const Page = ({
  title,
  children,
  settings,
  hideNavbar,
  isProtected,
}: PageProps) => {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME
  const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

  const { active, account, activate, deactivate, error } = useWeb3React()
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isProtected)
      injected.isAuthorized().then((isAuthorized) => {
        const connectedUser = getConnectedUser()

        if (connectedUser && isAuthorized && !error) {
          setLoaded(true)
        } else {
          router.push("/")
        }
      })
  }, [activate, active, error])

  useEffect(() => {
    if (account) connectServer()
  }, [account])

  const connectServer = async () => {
    try {
      const { data } = await axios.post("/api/auth", {
        address: account,
      })
      if (!data.success) return showToast(data.message, "error")

      saveConnectedUser(data.data)
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }

  const connectBrowser = async (e: any) => {
    e.preventDefault()

    try {
      await activate(injected)
      setShowAuthModal(false)
      router.push("/account")
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }

  if (isProtected && !loaded) return null

  return (
    <div>
      {/* Connect wallet modal */}
      <AppModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        size="sm"
        title="Connect a Wallet"
      >
        <button className="login-btn" onClick={connectBrowser}>
          <span className="me-3">
            <Image src={metamaskIcon} width={22} height={22} />
          </span>
          MetaMask
        </button>

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
      {/*  */}

      <div className="all-page">
        <Head>
          <title>
            {businessName + " - "}
            {title}
          </title>

          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`NFT Collection Generator - ${businessName}`}
          />
          <meta
            name="twitter:title"
            content="Create a 10,000 NFT collection with Rarity settings from your assets with SOL and ETH metadata."
          />

          <meta
            name="description"
            content="Create a 10,000 NFT collection with Rarity settings from your assets with SOL and ETH metadata. Ready to mint at blockchain or marketplaces."
          />
          <meta
            name="keywords"
            content="NFT, NFT Art Generator, Art Generator, Layered Art Generator, Collectibles, NFT Generator, NFT Collections, NFT Random"
          />

          <meta name="robots" content="index, follow" />

          <link rel="icon" href="/images/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          ></link>
        </Head>

        {/* Toast */}
        <ToastContainer
          draggable={false}
          position="bottom-center"
          transition={Zoom}
          icon={false}
          closeButton={false}
          autoClose={false}
        />

        <PageContext.Provider
          value={{
            showAuthModal,
            setShowAuthModal,
            settings,
          }}
        >
          <>
            {!hideNavbar && <Header />}

            <main>{children}</main>

            {!hideNavbar && <Footer />}
          </>
        </PageContext.Provider>

        {/* Google Analytics */}
        {settings?.googleAnalyticsTrackingCode && (
          <>
            <Script
              id="google-anaylics1"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${settings?.googleAnalyticsTrackingCode}`}
            ></Script>

            <Script id="google-anaylics2" strategy="lazyOnload">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${settings?.googleAnalyticsTrackingCode}');
        `}
            </Script>
          </>
        )}

        {/* Crisp */}
        <Script>
          {`
    window.$crisp=[];window.CRISP_WEBSITE_ID="${CRISP_WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();    
    `}
        </Script>
      </div>
    </div>
  )
}

export default Page
