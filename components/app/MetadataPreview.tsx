import React, { useContext, useEffect, useState } from "react"
import AppContext from "../../context/AppContext"
import { getMetadata } from "../../helpers/utils"
import JsonPreview from "./JsonPreview"

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

  const handleGetMeta = () => {
    const { metadata } = getMetadata(collection, item, index)
    setMetadata(metadata)
  }

  if (!metadata) return null

  return <JsonPreview json={metadata} />
}

export default MetadataPreview
