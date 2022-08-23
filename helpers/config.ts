const shuffleLayerConfigurations = false

const format = {
  smoothing: false,
}

const gif = {
  export: true,
  repeat: 0,
  quality: 30,
  delay: 500,
}

const watermarkSettings = {
  color: "#ffffff",
  size: 40,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Arial",
}

const pixelFormat = {
  ratio: 2 / 128,
}

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
}

const rarityDelimiter = "#"

const uniqueDnaTorrance = 10000

export {
  format,
  background,
  uniqueDnaTorrance,
  rarityDelimiter,
  shuffleLayerConfigurations,
  pixelFormat,
  watermarkSettings,
  gif,
}
