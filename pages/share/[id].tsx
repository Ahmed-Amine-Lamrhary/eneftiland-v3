import React, { useEffect, useState } from "react"
import Page from "../../components/Page"
import AppContext from "../../context/AppContext"
import { PrismaClient } from "@prisma/client"
import Header from "../../components/Header"
import GalleryPanel from "../../components/app/panels/GalleryPanel"
import { parseCollection } from "../../services/parser"

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

  const collectionData = parseCollection(collection)

  return {
    props: {
      settings,
      forAdmin: collectionshare.forAdmin,
      collectionData,
    },
  }
}

const AppWrapper = ({ settings, collectionData }: any) => {
  const [collection, setCollection] = useState<any>(collectionData)

  const [results, setResults] = useState<any>(collectionData.results)
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null)
  const [filteredItems, setFilteredItems] = useState<any>(
    collectionData.results
  )

  // loadings
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingFolder, setUploadingFolder] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  // loadings

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
          <Header isApp />

          <div className="app-container">
            <GalleryPanel isReadonly />
          </div>
        </div>
      </AppContext.Provider>
    </Page>
  )
}

export default AppWrapper
