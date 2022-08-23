export const errorMessages = {
  requiredField: "This field is required",

  collectionSizeMin: "Minimum collection size is 1",
  collectionSizeMax: "Maximum collection size is 20000",

  sizeMin: "Item size should be at least 5",
  sizeMax: "Item size should be at least 2400",

  layers: "Please add at least 1 layer",
  layerName: "Each layer should have a name",
  layerImages: "Please add at least 1 image in each layer",
}

export const blendList: any = [
  "source-over",
  "source-in",
  "source-out",
  "source-out",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]

export const NETWORK = {
  eth: "eth",
  sol: "sol",
}

const zeroDecimalCurrencies = [
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]

export const getPaymentAmount = (amount: number, currency: any) => {
  if (zeroDecimalCurrencies.includes(currency)) return amount
  return amount * 100
}

export const plansFeaturesDelimiter = "|||"

export const CURRENCY = "USD"
