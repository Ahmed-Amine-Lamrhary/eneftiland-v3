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
  callApi,
  getConnectedUser,
  saveConnectedUser,
  showToast,
} from "../helpers/utils"
import PageContext from "../context/PageContext"
import ConnectWallet from "./ConnectWallet"

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
  const businessName = settings?.businessName ? settings?.businessName : ""

  const { active, account, activate, error } = useWeb3React()
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isProtected) {
      injected.isAuthorized().then((isAuthorized) => {
        const connectedUser = getConnectedUser()

        if (connectedUser && isAuthorized && !error) {
          setLoaded(true)
        } else {
          router.push("/")
        }
      })
    }
  }, [activate, active, error])

  useEffect(() => {
    if (account) connectServer()
  }, [account])

  const connectServer = async () => {
    try {
      const { data } = await callApi({
        route: "auth",
        body: {
          address: account,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      saveConnectedUser(data.data)
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }

  const connectBrowser = async () => {
    try {
      await activate(injected, (error) => console.log(error), true)

      setShowAuthModal(false)
      router.push("/account")
    } catch (error: any) {
      console.log(error)
      // showToast(error.message, "error")
    }
  }

  if (isProtected && !loaded) return null

  return (
    <div>
      <div className="all-page">
        <Head>
          <title>
            {businessName}
            {businessName && " - "}
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

          <link
            rel="icon"
            href={settings?.faviconUrl ? settings?.faviconUrl : ""}
          />

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
        />

        <PageContext.Provider
          value={{
            showAuthModal,
            setShowAuthModal,
            settings,
            connectBrowser,
          }}
        >
          <>
            {/* Connect wallet modal */}
            <ConnectWallet />
            {/* Connect wallet modal */}

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
      </div>
    </div>
  )
}

export default Page
