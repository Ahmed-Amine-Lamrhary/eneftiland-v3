type blendT =
  | "source-over"
  | "source-in"
  | "source-out"
  | "source-out"
  | "destination-over"
  | "destination-in"
  | "destination-out"
  | "destination-atop"
  | "lighter"
  | "copy"
  | "xor"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"

export default interface LayerI {
  id: string
  name: string
  images?: any[]
  totalPoints: number
  options: {
    bypassDNA: boolean
    blend: blendT
    opacity: number
  }
  isAdvanced: boolean
}
