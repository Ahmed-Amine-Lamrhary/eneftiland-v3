import React, { useEffect, useState } from "react"
import Page from "../../components/Page"
import AppContext from "../../context/AppContext"
import { PrismaClient } from "@prisma/client"
import { useRouter } from "next/router"
import { callApi } from "../../helpers/utils"
import Header from "../../components/Header"
import GalleryPanel from "../../components/app/panels/GalleryPanel"
import AppLoader from "../../components/AppLoader"

export async function getServerSideProps(context: any) {
  const { id, key } = context.query

  if (!key)
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }

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

  // check key
  const collectionshare = await prisma.collectionshare.findFirst({
    where: {
      id: key,
      collectionId: id,
      isActive: true,
    },
  })

  if (!collectionshare)
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }

  const settings = await prisma.settings.findFirst()

  return {
    props: {
      settings,
    },
  }
}

const AppWrapper = ({ settings }: any) => {
  const router = useRouter()
  const { id: collectionId }: any = router.query

  const [collection, setCollection] = useState<any>()

  const [results, setResults] = useState<any>()
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null)
  const [filteredItems, setFilteredItems] = useState<any>([])

  // loadings
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingFolder, setUploadingFolder] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  // loadings

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
    getData()
  }, [])

  const getData = async () => {
    try {
      const { data } = await callApi({
        route: "collection",
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

  useEffect(() => {
    setFilteredItems(results)
  }, [results])

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
          activeLayerId,
          setActiveLayerId,
          loading,
          setLoading,
          setResults,
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
        }}
      >
        <div className="app-panel">
          <Header />

          <div className="app-container">
            <GalleryPanel isReadonly />
          </div>
        </div>
      </AppContext.Provider>
    </Page>
  )
}

export default AppWrapper
