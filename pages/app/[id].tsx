import React, { useEffect, useState } from "react"
import Page from "../../components/Page"
import AppContext from "../../context/AppContext"
import Application from "../../components/app/Application"
import { parseCollection } from "../../services/parser"
import { PrismaClient } from "@prisma/client"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import { useRouter } from "next/router"

export async function getServerSideProps(context: any) {
  const { id } = context.query

  const prisma = new PrismaClient()

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

  const settings = await prisma.settings.findFirst()
  const plans = await prisma.plan.findMany({
    orderBy: {
      assetsNumber: "asc",
    },
  })
  const collectionData = parseCollection(collection)

  return {
    props: {
      settings,
      plans,
      collectionData,
    },
  }
}

const App = ({ settings, plans }: any) => {
  const { active, account, activate, deactivate } = useWeb3React()

  const router = useRouter()
  const { id: collectionId }: any = router.query

  const [collection, setCollection] = useState<any>()
  const [results, setResults] = useState<any>()

  const [activeLayerId, setActiveLayerId] = useState<string | null>(null)
  const [filteredItems, setFilteredItems] = useState<any>([])

  const [view, setView] = useState<
    "designer" | "settings" | "rules" | "preview" | "generate"
  >("designer")

  // loadings
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingFolder, setUploadingFolder] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    if (account) getCollection()
  }, [account])

  const getCollection = async () => {
    try {
      const { data }: any = await axios.post("/api/me/mycollection", {
        id: collectionId,
        address: account,
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

  useEffect(() => {
    setFilteredItems(results)
  }, [results])

  const setLayers = (layers: any) => {
    setCollection({ ...collection, layers })
  }

  const addToResults = (item: any) => {
    setResults([...results, item])
  }

  if (loadingPage) return null

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
          view,
          setView,
          settings,
          filteredItems,
          setFilteredItems,
          results,
          uploadingFolder,
          setUploadingFolder,
          isSaving,
          setIsSaving,
          uploadingImages, setUploadingImages
        }}
      >
        <Application settings={settings} plans={plans} />
      </AppContext.Provider>
    </Page>
  )
}

export default App
