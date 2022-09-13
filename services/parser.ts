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

  historyData.creators = historyData.creators
    ? JSON.parse(historyData.creators)
    : []

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
        const elementsArray = item.split(",")
        const traits = elementsArray.splice(0, elementsArray.length - 1)

        const attributes = traits.map((trait: any) => {
          const layerIndex = parseInt(trait.split("+")[0])
          const imgIndex = parseInt(trait.split("+")[1])

          let keyword = useLayers === true ? "layers" : "galleryLayers"

          return {
            id: collection[keyword][layerIndex].images[imgIndex].id,
            trait_type: collection[keyword][layerIndex].name,
            value: collection[keyword][layerIndex].images[imgIndex].name,
            rarity: collection[keyword][layerIndex].images[imgIndex].rarity,
          }
        })

        return {
          attributes,
          itemIndex: index,
          totalRarity: elementsArray[elementsArray.length - 1],
        }
      })
    : []

  return resultsData
}

export { parseCollection, parseHistory, parseResults }
