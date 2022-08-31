import { Stripe, loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import moment from "moment"
import { toast } from "react-toastify"

export const getLayersImages = async ({
  collection,
  noFile = false,
  isHistory,
}: any) => {
  const allLayersImages: any = []
  await Promise.all(
    collection[isHistory ? "layers" : "galleryLayers"].map(
      async (layer: any) => {
        await Promise.all(
          layer.images.map(async (image: any) => {
            let r
            if (!noFile) r = await loadImage(image.url)

            allLayersImages.push({
              id: image.id,
              name: image.name,
              file: r,
              filename: image.filename,
              url: image.url,
            })
          })
        )
      }
    )
  )

  return allLayersImages
}

export const getWatermarkCred = ({ dimensions, position }: any) => {
  const watermarkSize = dimensions / 4

  let x,
    y,
    w = watermarkSize,
    h = watermarkSize

  switch (position) {
    case "top-left":
      x = 0
      y = 0
      break
    case "top-right":
      x = dimensions - watermarkSize
      y = 0
      break
    case "bottom-left":
      x = 0
      y = dimensions - watermarkSize
      break
    case "bottom-right":
      x = dimensions - watermarkSize
      y = dimensions - watermarkSize
      break
    case "center":
      x = dimensions / 2 - watermarkSize / 2
      y = dimensions / 2 - watermarkSize / 2
      break
    case "full":
      x = 0
      y = 0
      w = dimensions
      h = dimensions
      break
  }

  return { x, y, w, h }
}

export function loadImage(url: string) {
  return new Promise((r) => {
    let i = new Image()
    i.crossOrigin = "anonymous"
    i.onload = () => r(i)
    i.src = url
  })
}

export function nFormatter(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"
  }
  return num
}

export const formatDate = (date: any) =>
  moment(date).format("dddd Do YYYY, h:mm a")

export const showToast = (
  message: string,
  type: "info" | "success" | "warning" | "error" | "default"
) => {
  toast(message, {
    type,
    hideProgressBar: true,
  })
}

const DNA_DELIMITER = "-"
const rarityDelimiter = "#"

export const filterDNAOptions = (_dna: any) => {
  const dnaItems = _dna.split(DNA_DELIMITER)
  const filteredDNA = dnaItems.filter((element: any) => {
    const query = /(\?.*$)/
    const querystring = query.exec(element)
    if (!querystring) {
      return true
    }
    const options: any = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=")
      return { ...r, [keyPairs[0]]: keyPairs[1] }
    }, [])

    return options.bypassDNA
  })

  return filteredDNA.join(DNA_DELIMITER)
}

export const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna)
  return !_DnaList.has(_filteredDNA)
}

export const createDna = (_layers: any) => {
  let randNum: any = []
  _layers.forEach((layer: any) => {
    var totalWeight = 0
    layer.elements.forEach((element: any) => {
      totalWeight += element.weight
    })
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight)
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        )
      }
    }
  })
  return randNum.join(DNA_DELIMITER)
}

export const layersSetup = (layersOrder: any) => {
  const layers = layersOrder.map((layerObj: any, index: any) => {
    return {
      id: index,
      elements: getElements(layerObj.images),
      name:
        layerObj.options?.["displayName"] != undefined
          ? layerObj.options?.["displayName"]
          : layerObj.name,
      blend:
        layerObj.options?.["blend"] != undefined
          ? layerObj.options?.["blend"]
          : "source-over",
      opacity:
        layerObj.options?.["opacity"] != undefined
          ? layerObj.options?.["opacity"]
          : 1,
      bypassDNA:
        layerObj.options?.["bypassDNA"] !== undefined
          ? layerObj.options?.["bypassDNA"]
          : false,
    }
  })
  return layers
}

const getElements = (images: any) => {
  return images.map((image: any, index: any) => {
    const { name, rarity } = image
    return {
      id: index,
      name,
      filename: name,
      weight: rarity,
    }
  })
}

const cleanName = (_str: any) => {
  let nameWithoutExtension = _str.slice(0, -4)
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift()
  return nameWithoutWeight
}

export const convertToEth = async (amount: number) => {
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`
  )

  const data = await response.json()

  const convertAmount = data[Object.keys(data)[0]]
  return amount / convertAmount
}

let stripePromise: Promise<Stripe | null>
export const getStripe = (publishableKey: string) => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

export function millisToMinutesAndSeconds(millis: any) {
  const minutes: any = Math.floor(millis / 60000)
  const seconds: any = ((millis % 60000) / 1000).toFixed(2)

  if (minutes == 0) return `${seconds} seconds`
  return `${minutes} minutes and ${seconds} seconds`
}

export const getMetadata = (collection: any, item: any, index: number) => {
  const edition = index + 1

  const tokenName = `${
    collection.prefix ? collection.prefix : collection.collectionName
  }#${edition}`

  let metadata: any = {
    name: tokenName,
    description: collection.collectionDesc,
    image: `ipfs://<CID>/${edition}.png`,
    attributes: item.attributes.map(({ trait_type, value }: any) => ({
      trait_type,
      value,
    })),
  }

  if (collection.network == "sol")
    metadata = {
      ...metadata,
      collection: {
        name: tokenName,
        family: collection.collectionName,
      },
      symbol: collection.symbol,
      seller_fee_basis_points: collection.royalties
        ? collection.royalties * 100
        : 0,
      external_url: collection.externalUrl,
      properties: {
        files: [
          {
            uri: `${edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: collection.creators,
      },
    }

  return { metadata, edition }
}

export const getMetadataPreview = (collection: any) => {
  const edition = 1

  const tokenName = `${
    collection.prefix ? collection.prefix : collection.collectionName
  }#${edition}`

  const attributes = collection.layers
    .filter((l: any) => l.images.length > 0)
    .map((layer: any) => ({
      trait_type: layer.name,
      value: layer.images[0].name,
    }))

  let metadata: any = {
    name: tokenName,
    description: collection.collectionDesc,
    image: `ipfs://<CID>/${edition}.png`,
    attributes,
  }

  if (collection.network == "sol")
    metadata = {
      ...metadata,
      collection: {
        name: tokenName,
        family: collection.collectionName,
      },
      symbol: collection.symbol,
      seller_fee_basis_points: collection.royalties
        ? collection.royalties * 100
        : 0,
      external_url: collection.externalUrl,
      properties: {
        files: [
          {
            uri: `${edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: collection.creators,
      },
    }

  return metadata
}

// call api
interface CallApiI {
  route: string
  body?: any
}

export const callApi = async ({ route, body }: CallApiI) => {
  try {
    const response = await axios.post(`/api/${route}`, body)

    return response
  } catch (error) {
    throw error
  }
}
