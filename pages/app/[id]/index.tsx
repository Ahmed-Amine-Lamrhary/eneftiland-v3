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
import { getSession } from "next-auth/react"
import Share from "../../../components/Share"
import { parseCollection } from "../../../services/parser"

export async function getServerSideProps(context: any) {
  const { id } = context.query

  const { req } = context
  const session: any = await getSession({ req })

  if (!session)
    return {
      redirect: { destination: "/" },
    }

  const prisma = new PrismaClient()

  const collection = await prisma.collection.findFirst({
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

  const isCollaborator = await prisma.collaborations.findFirst({
    where: {
      collectionId: id,
      userId: session?.user?.id,
    },
  })

  if (collection.userId !== session?.user?.id && !isCollaborator)
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

  const settings = await prisma.settings.findFirst()
  const plans = await prisma.plan.findMany({
    orderBy: {
      assetsNumber: "asc",
    },
  })

  return {
    props: {
      settings,
      plans,
      collectionshare,
      collectionData: parseCollection(collection),
      isCollaborator: isCollaborator ? true : false,
    },
  }
}

const AppWrapper = ({
  settings,
  plans,
  collectionshare,
  collectionData,
  isCollaborator,
}: any) => {
  const router = useRouter()
  const { id: collectionId, page }: any = router.query

  const [collection, setCollection] = useState<any>(collectionData)

  const [results, setResults] = useState<any>(collectionData.results)
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
          <Header setShowShare={setShowShare} isCollaborator={isCollaborator}>
            <AppNavbar />
          </Header>

          {typeof window !== "undefined" && (
            <Share
              showShare={showShare}
              setShowShare={setShowShare}
              collectionshare={collectionshare}
            />
          )}

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
