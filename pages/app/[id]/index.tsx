import React, { useCallback, useEffect, useState } from "react"
import Page from "../../../components/Page"
import AppContext from "../../../context/AppContext"
import { parseResults } from "../../../services/parser"
import { PrismaClient } from "@prisma/client"
import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import {
  callApi,
  millisToMinutesAndSeconds,
  showToast,
} from "../../../helpers/utils"
import Header from "../../../components/Header"
import AppNavbar from "../../../components/app/panels/AppNavbar"
import debounce from "lodash.debounce"
import swal from "sweetalert2"
import SettingsPanel from "../../../components/app/panels/SettingsPanel"
import RulesPanel from "../../../components/app/panels/RulesPanel"
import GalleryPanel from "../../../components/app/panels/GalleryPanel"
import GeneratePanel from "../../../components/app/panels/GeneratePanel"
import DesignerPanel from "../../../components/app/panels/DesignerPanel"
import AppLoader from "../../../components/AppLoader"

export async function getServerSideProps(context: any) {
  const { id } = context.query

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

  return {
    props: {
      settings,
      plans,
    },
  }
}

const AppWrapper = ({ settings, plans }: any) => {
  const { account } = useWeb3React()

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

  // loadings
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingFolder, setUploadingFolder] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  // loadings

  const [count, setCount] = useState<number>(0)
  const [error, setError] = useState<any>(null)
  const [generationTime, setGenerationTime] = useState<string>("")

  const verify = useCallback(
    debounce((layers) => {
      updateLayers(layers)
    }, 1000),
    []
  )

  // rarity score
  useEffect(() => {
    console.log(results)

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

  const updateResults = async (resultsString: string) => {
    try {
      setIsSaving(true)

      const currentCollection: any = {
        results: resultsString,
        galleryLayers: JSON.stringify(collection?.layers),
      }

      const { data } = await callApi({
        route: "me/updatecollection",
        body: {
          id: collectionId,
          currentCollection,
        },
      })

      if (!data.success) return showToast(data.message, "error")
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const generate = async (ignoreWarning: boolean) => {
    try {
      if (!ignoreWarning && results && results.length > 0) {
        const willRegenerate = await swal.fire({
          title: "Are you sure?",
          text: "Your current data will be lost",
          icon: "warning",
          confirmButtonText: "Yes, Regenerate",
          cancelButtonText: "No, Cancel",
          showCancelButton: true,
          showCloseButton: true,
        })

        if (!willRegenerate.isConfirmed) return
      }

      if (!ignoreWarning) window.scrollTo(0, 0)

      setLoading(true)

      const { data: generatedData } = await callApi({
        route: "generate",
        body: {
          collection,
        },
      })

      const { success, data, message } = generatedData

      if (!success) {
        setLoading(false)
        return showToast(message, "error")
      }

      const resultsString = data.metadata
        .map((i: any) => {
          const attrs = i.attributes.map((a: any) => {
            const layer = collection?.layers?.find(
              (l: any) => l.name === a.trait_type
            )
            const layerIndex = collection?.layers?.findIndex(
              (l: any) => l.name === a.trait_type
            )

            const imageIndex = layer?.images?.findIndex(
              (img: any) => img.name === a.value
            )

            return `${layerIndex}+${imageIndex}`
          })

          return attrs.join(",")
        })
        .join("|")

      const resultsData = parseResults(collection, resultsString, true)

      setCollection({ ...collection, galleryLayers: collection?.layers })
      setResults(resultsData)
      if (!ignoreWarning) {
        router.push(
          {
            pathname: `/app/${collection?.id}`,
            query: { page: "gallery" },
          },
          undefined,
          { scroll: false }
        )
        setView("gallery")
      }
      setLoading(false)

      // generation time
      setGenerationTime(millisToMinutesAndSeconds(data.genTime))

      // update results
      await updateResults(resultsString)
    } catch (error: any) {
      console.log(error)
      if (error.name !== "ValidationError") setError(error)

      showToast(error.message, "error")
      if (!ignoreWarning) {
        router.push(
          {
            pathname: `/app/${collection?.id}`,
            query: { page: "gallery" },
          },
          undefined,
          { scroll: false }
        )
        setView("gallery")
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account) getData()
  }, [account])

  const getData = async () => {
    try {
      const { data } = await callApi({
        route: "me/mycollection",
        body: {
          id: collectionId,
          address: account,
        },
      })

      console.log(data)

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
    <Page title="NFT Generator" settings={settings} hideNavbar isProtected>
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
          generate,
          generationTime,
          view,
          setView,
        }}
      >
        <div className="app-panel">
          <Header>
            <AppNavbar />
          </Header>

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
