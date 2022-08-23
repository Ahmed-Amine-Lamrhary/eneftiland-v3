import { Stripe, loadStripe } from "@stripe/stripe-js"
import { loadImage } from "canvas"
import moment from "moment"
import { toast } from "react-toastify"
import CollectionI from "../types/CollectionI"

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

export const convertToEth = async (amount: number, currency?: string) => {
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${
      currency || "USD"
    }`
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

export const getMetadata = (
  collection: any,
  allLayersImages: any,
  item: any,
  index: number
) => {
  const edition = index + 1

  const files: any = []
  item?.attributes.forEach((attr: any) => {
    const f = allLayersImages.find((l: any) => l.id === attr.id)
    const imgExtension = f?.filename.split(".").pop()
    files.push({
      uri: f?.url,
      type: `image/${imgExtension}`,
    })
  })

  let metadata: any = {
    name: `${
      collection.prefix ? collection.prefix : collection.collectionName
    }#${edition}`,
    description: collection.collectionDesc,
    image: `ipfs://<CID>/${edition}.png`,
    attributes: item.attributes,
    date: Date.now(),
    filename: `${edition}.json`,
  }

  if (collection.network == "sol")
    metadata = {
      ...metadata,
      symbol: collection.symbol,
      seller_fee_basis_points: collection.royalties,
      external_url: collection.externalUrl,
      properties: {
        files,
        category: "image",
        creators: collection.creators,
      },
    }

  return { metadata, edition }
}

interface getLayersImagesI {
  collection: any
  noFile?: boolean
}

export const getLayersImages = async ({
  collection,
  noFile = false,
}: getLayersImagesI) => {
  const allLayersImages: any = []
  await Promise.all(
    collection.layers.map(async (layer: any) => {
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
    })
  )

  return allLayersImages
}

// connected user
export const saveConnectedUser = (user: any) => {
  if (user)
    localStorage.setItem("eneftiland-connected-user", JSON.stringify(user))
}
export const removeConnectedUser = () => {
  localStorage.removeItem("eneftiland-connected-user")
}
export const getConnectedUser = () => {
  const connectedUser = localStorage.getItem("eneftiland-connected-user")
  return connectedUser ? JSON.parse(connectedUser) : null
}
