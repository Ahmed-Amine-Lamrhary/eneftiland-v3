import dynamic from "next/dynamic"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "../../context/AppContext"
import { getLayersImages, getMetadata } from "../../helpers/utils"

const DynamicReactJson: any = dynamic(import("react-json-view"), { ssr: false })

interface MetadataPreviewProps {
  item: any
  index: number
}

const MetadataPreview = ({ item, index }: MetadataPreviewProps) => {
  const { collection } = useContext(AppContext)
  const [metadata, setMetadata] = useState()

  useEffect(() => {
    handleGetMeta()
  }, [collection])

  const handleGetMeta = async () => {
    const allLayersImages = await getLayersImages({
      collection,
      noFile: true,
    })

    const { metadata } = getMetadata(collection, allLayersImages, item, index)
    setMetadata(metadata)
  }

  if (!metadata) return null

  return (
    <div>
      <DynamicReactJson
        src={metadata}
        name={false}
        collapsed={1}
        displayDataTypes={false}
        enableClipboard={false}
        collapseStringsAfterLength={20}
        displayObjectSize={false}
        theme="grayscale:inverted"
      />
    </div>
  )
}

export default MetadataPreview
