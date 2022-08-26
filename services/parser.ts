const parseCollection = (data: any) => {
  const collectionData = { ...data }

  collectionData.dateCreated = collectionData.dateCreated.toString()
  collectionData.layers = collectionData.layers
    ? JSON.parse(collectionData.layers)
    : []

  if (collectionData.galleryLayers)
    collectionData.galleryLayers = collectionData.galleryLayers
      ? JSON.parse(collectionData.galleryLayers)
      : []

  collectionData.creators = collectionData.creators
    ? JSON.parse(collectionData.creators)
    : []

  const resultsData = parseResults(collectionData, collectionData.results)

  collectionData.results = resultsData

  return collectionData
}

const parseHistory = (data: any) => {
  const historyData = { ...data }

  historyData.dateCreated = historyData.dateCreated.toString()
  historyData.layers = historyData.layers ? JSON.parse(historyData.layers) : []

  const resultsData = parseResults(historyData, historyData.results, true)

  historyData.results = resultsData

  return historyData
}

const parseResults = (
  collection: any,
  resultsString: string,
  useLayers?: boolean
) => {
  const resultsData = resultsString
    ? resultsString.split("|").map((item: any, index: number) => {
        const traits = item.split(",")

        const attributes = traits.map((trait: any) => {
          const layerIndex = parseInt(trait.split("+")[0])
          const imgIndex = parseInt(trait.split("+")[1])

          if (useLayers === true)
            return {
              id: collection.layers[layerIndex].images[imgIndex].id,
              trait_type: collection.layers[layerIndex].name,
              value: collection.layers[layerIndex].images[imgIndex].name,
              rarity: collection.layers[layerIndex].images[imgIndex].rarity,
            }
          else {
            return {
              id: collection.galleryLayers[layerIndex].images[imgIndex].id,
              trait_type: collection.galleryLayers[layerIndex].name,
              value: collection.galleryLayers[layerIndex].images[imgIndex].name,
              rarity:
                collection.galleryLayers[layerIndex].images[imgIndex].rarity,
            }
          }
        })

        return {
          attributes,
          itemIndex: index,
        }
      })
    : []

  return resultsData
}

export { parseCollection, parseHistory, parseResults }
