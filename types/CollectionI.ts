import LayerI from "./LayerI"

export default interface CollectionI {
  id?: string
  userId?: string

  collectionName: string
  collectionDesc: string
  collectionSize: number
  symbol: string

  size: number
  cid?: string

  network: string
  externalUrl: string
  prefix: string

  creators: any[]
  royalties: number

  layers?: LayerI[]
  galleryLayers?: LayerI[]

  results?: any[]

  dateCreated: any
}
