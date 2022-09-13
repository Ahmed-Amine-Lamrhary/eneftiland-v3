import {
  background,
  shuffleLayerConfigurations,
  uniqueDnaTorrance,
} from "./config"
import { NETWORK } from "./constants"
const sha1 = require("sha1")

var metadataList: any = []
var attributesList: any = []
var dnaList = new Set()
const DNA_DELIMITER = "-"

const cleanDna = (_str: any) => {
  const withoutOptions = removeQueryStrings(_str)
  var dna = Number(withoutOptions.split(":").shift())
  return dna
}

export const cleanName = (_str: any) => {
  let nameWithoutExtension = _str.slice(0, -4)
  return nameWithoutExtension
}

const getElements = (images: any, totalPoints: any) => {
  return images.map(({ id, url, file, rarity, name }: any, index: any) => {
    return {
      id: index,
      identifier: id,
      name,
      filename: file?.name,
      path: url,
      weight: (rarity * 100) / totalPoints,
    }
  })
}

const layersSetup = (layersOrder: any) => {
  const layers = layersOrder.map((layerObj: any, index: any) => {
    return {
      id: layerObj.id,
      elements: getElements(layerObj.images, layerObj.totalPoints),
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

const genColor = () => {
  let hue = Math.floor(Math.random() * 360)
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`
  return pastel
}

const addMetadata = (
  index: number,
  _dna: any,
  _edition: any,
  namePrefix: any,
  description: any,
  network: any,
  solanaMetadata?: any
) => {
  let dateTime = Date.now()

  let tempMetadata: any = {
    name: `${namePrefix} #${_edition}`,
    description: description,
    image: `${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  }

  // solana
  if (network == NETWORK.sol) {
    tempMetadata = {
      name: tempMetadata.name,
      description: tempMetadata.description,
      image: `${_edition}.png`,
      edition: _edition,
      attributes: tempMetadata.attributes,

      symbol: solanaMetadata.symbol,
      seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
      external_url: solanaMetadata.external_url,
      properties: {
        files: [
          {
            uri: `${_edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: solanaMetadata.creators,
      },
    }
  }

  const item = { ...tempMetadata, itemIndex: index }
  metadataList.push(item)

  attributesList = []
}

const addAttributes = (_element: any) => {
  attributesList.push({
    id: _element.selectedElement.identifier,
    trait_type: _element.name,
    value: _element.selectedElement.name,
    rarity: _element.selectedElement.weight,
  })
}

const constructLayerToDna = (_dna = "", _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer: any, index) => {
    let selectedElement = layer.elements.find((e: any) => {
      return e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    })

    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement,
    }
  })
  return mappedDnaToLayers
}

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna: any) => {
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

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna: any) => {
  const query = /(\?.*$)/
  return _dna.replace(query, "")
}

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna)
  return !_DnaList.has(_filteredDNA)
}

const createDna = (_layers: any, rules: any) => {
  let randNum: any = []
  let randNames: any[] = []
  let pass = false
  let x = 0

  while (!pass && x < 50) {
    randNames = []
    randNum = []

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
          randNames.push(`${layer.name}:${layer.elements[i].name}`)
          randNum.push(`${layer.elements[i].id}:${layer.elements[i].filename}`)
          return
        }
      }
    })

    let passes: boolean[] = []

    rules.forEach((rule: any) => {
      const trait1 = rule.trait1
      const condition = rule.condition
      const trait2 = rule.trait2

      let rulePass = false

      if (condition === "doesNotMixWith") {
        // doesn't mix with
        if (!randNames.includes(trait1) || !randNames.includes(trait2)) {
          rulePass = true
        }
      } else if (condition === "onlyMixesWith") {
        // only mixes with
        if (randNames.includes(trait1)) {
          if (randNames.includes(trait2)) {
            rulePass = true
          }
        } else {
          rulePass = true
        }
      }

      passes.push(rulePass)
    })

    if (!passes.includes(false)) pass = true
    x++
  }

  return pass ? randNum.join(DNA_DELIMITER) : ""
}

function shuffle(array: any) {
  let currentIndex = array.length,
    randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
  return array
}

const startCreating = async (rules: any, collection: any) => {
  const {
    collectionDesc,
    collectionName,
    collectionSize,
    creators,
    externalUrl,
    network,
    prefix,
    royalties,
    symbol,
  } = collection

  const metadata = {
    symbol,
    seller_fee_basis_points: royalties,
    external_url: externalUrl,
    creators,
  }

  const layerConfigurations = [
    {
      growEditionSizeTo: collectionSize,
      layersOrder: collection.layers
        .slice()
        .reverse()
        .filter((l: any) => l.images.length > 0),
    },
  ]

  metadataList = []
  // var startTime = performance.now()

  let layerConfigIndex = 0
  let editionCount = 1
  let failedCount = 0
  let abstractedIndexes: any = []

  for (
    let i = network == NETWORK.sol ? 0 : 1;
    i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i)
  }

  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes)
  }

  while (layerConfigIndex < layerConfigurations.length) {
    dnaList.clear()

    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder
    )

    while (editionCount <= collectionSize) {
      let newDna = createDna(layers, rules)

      if (newDna && isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layers)
        let loadedElements: any = []

        results.forEach((layer) => {
          loadedElements.push(layer)
        })

        loadedElements.forEach((renderObject: any) => {
          addAttributes(renderObject)
        })

        addMetadata(
          editionCount - 1,
          newDna,
          abstractedIndexes[0],
          prefix ? prefix : collectionName,
          collectionDesc,
          network,
          metadata
        )

        dnaList.add(filterDNAOptions(newDna))
        abstractedIndexes.shift()

        editionCount++
      } else {
        // DNA exists
        failedCount++
        if (failedCount >= uniqueDnaTorrance) {
          return {
            success: false,
            error: `Please add more layers or elements or check your rules`,
          }
        }
      }
    }

    layerConfigIndex++
  }

  // var endTime = performance.now()

  return {
    success: true,
    data: metadataList,
  }
}

export { startCreating, getElements }
