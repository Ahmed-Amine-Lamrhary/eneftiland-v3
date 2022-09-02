import React, { useCallback, useEffect, useState } from "react"
import Page from "../../../components/Page"
import AppContext from "../../../context/AppContext"
import { PrismaClient } from "@prisma/client"
import { useRouter } from "next/router"
import { callApi, showToast } from "../../../helpers/utils"
import Header from "../../../components/Header"
import AppNavbar from "../../../components/app/panels/AppNavbar"
import debounce from "lodash.debounce"
import SettingsPanel from "../../../components/app/panels/SettingsPanel"
import RulesPanel from "../../../components/app/panels/RulesPanel"
import GalleryPanel from "../../../components/app/panels/GalleryPanel"
import GeneratePanel from "../../../components/app/panels/GeneratePanel"
import DesignerPanel from "../../../components/app/panels/DesignerPanel"
import AppLoader from "../../../components/AppLoader"
import { getSession, useSession } from "next-auth/react"
import AppModal from "../../../components/AppModal"
import Button from "../../../components/Button"
import Share from "../../../components/Share"

export async function getServerSideProps(context: any) {
  const { id } = context.query

  const { req } = context
  const session = await getSession({ req })

  if (!session)
    return {
      redirect: { destination: "/" },
    }

  const prisma = new PrismaClient()

  const settings = await prisma.settings.findFirst()
  const plans = await prisma.plan.findMany({
    orderBy: {
      assetsNumber: "asc",
    },
  })

  const collection = await prisma.collection.findUnique({
    where: {
      id,
    },
  })

  if (!collection)
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }

  const collectionshare = await prisma.collectionshare.findFirst({
    where: {
      collectionId: collection.id,
      forAdmin: false,
    },
  })

  return {
    props: {
      settings,
      plans,
      collectionshare,
    },
  }
}

const AppWrapper = ({ settings, plans, collectionshare }: any) => {
  const { status } = useSession()

  const router = useRouter()
  const { id: collectionId, page }: any = router.query

  const [collection, setCollection] = useState<any>()

  const [results, setResults] = useState<any>()
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null)
  const [filteredItems, setFilteredItems] = useState<any>([])

  // view
  const [view, setView] = useState<
    "layers" | "settings" | "rules" | "gallery" | "generate"
  >(
    page &&
      ["layers", "settings", "rules", "gallery", "generate"].includes(page)
      ? page
      : "layers"
  )

  const [showShare, setShowShare] = useState<boolean>(false)

  // loadings
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingFolder, setUploadingFolder] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  // loadings

  const [count, setCount] = useState<number>(0)

  const verify = useCallback(
    debounce((layers) => {
      updateLayers(layers)
    }, 1000),
    []
  )

  // rarity score
  useEffect(() => {
    results?.map((item: any) => {
      const sum = item.attributes.reduce((currentSum: any, attr: any) => {
        const total = results.filter((r: any) =>
          r.attributes.some((a: any) => a.id === attr.id)
        ).length

        return currentSum + total
        // return currentSum + attr.rarity
      }, 0)

      item["totalRarity"] = sum
      return item
    })
  }, [results])
  // rarity score

  useEffect(() => {
    if (collection) {
      if (count > 0) verify(collection?.layers)
      setCount(count + 1)
    }
  }, [collection?.layers])

  const updateLayers = async (layers: any) => {
    try {
      setIsSaving(true)

      const { data } = await callApi({
        route: "me/updatelayers",
        body: {
          id: collectionId,
          layers,
        },
      })

      if (!data.success) return showToast(data.message, "error")
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") getData()
  }, [status])

  const getData = async () => {
    try {
      const { data } = await callApi({
        route: "me/mycollection",
        body: {
          id: collectionId,
        },
      })

      if (!data.success) {
        return router.push("/404")
      }

      setCollection(data.data)
      setResults(data.data.results)

      setLoadingPage(false)
    } catch (error: any) {
      console.log(error)
      router.push("/404")
    }
  }

  // paypal
  useEffect(() => {
    if (settings && settings.paypalClientId) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${settings.paypalClientId}`
      document.body.appendChild(script)
    }
  }, [])
  // paypal

  useEffect(() => {
    setFilteredItems(results)
  }, [results])

  const setLayers = (layers: any) => {
    setCollection({ ...collection, layers })
  }

  const addToResults = (item: any) => {
    setResults([...results, item])
  }

  if (loadingPage)
    return (
      <div className="loading-panel">
        <AppLoader />
      </div>
    )

  return (
    <Page title={collection.collectionName} settings={settings} hideNavbar>
      <AppContext.Provider
        value={{
          collection,
          setCollection,
          setLayers,
          activeLayerId,
          setActiveLayerId,
          loading,
          setLoading,
          setResults,
          addToResults,
          settings,
          filteredItems,
          setFilteredItems,
          results,
          uploadingFolder,
          setUploadingFolder,
          isSaving,
          setIsSaving,
          uploadingImages,
          setUploadingImages,
          view,
          setView,
        }}
      >
        <div className="app-panel">
          <Header setShowShare={setShowShare}>
            <AppNavbar />
          </Header>

          <Share
            showShare={showShare}
            setShowShare={setShowShare}
            collectionshare={collectionshare}
          />

          <div className="app-container">
            {view === "layers" && <DesignerPanel />}
            {view === "settings" && <SettingsPanel />}
            {view === "rules" && <RulesPanel />}
            {view === "gallery" && <GalleryPanel />}
            {view === "generate" && (
              <GeneratePanel plans={plans} settings={settings} />
            )}
          </div>
        </div>
      </AppContext.Provider>
    </Page>
  )
}

export default AppWrapper
