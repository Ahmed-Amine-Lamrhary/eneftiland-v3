import React from "react"
import CollectionI from "../types/CollectionI"

interface AppContextInterface {
  collection: CollectionI | null
  setCollection: any
  setLayers?: any
  activeLayerId: string | null
  setActiveLayerId: any
  loading: boolean
  setLoading: any
  setResults: any
  settings: any
  filteredItems: any[]
  setFilteredItems: any
  results: any
  uploadingFolder: boolean
  setUploadingFolder: any
  isSaving: boolean
  setIsSaving: any
  uploadingImages: boolean
  setUploadingImages: any
  view?: "layers" | "settings" | "rules" | "gallery" | "generate"
  setView?: any
}

const AppContext = React.createContext<AppContextInterface>({
  collection: null,
  setCollection: null,
  setLayers: null,
  activeLayerId: null,
  setActiveLayerId: null,
  loading: false,
  setResults: null,
  settings: null,
  setLoading: null,
  filteredItems: [],
  setFilteredItems: null,
  results: [],
  uploadingFolder: false,
  setUploadingFolder: null,
  isSaving: false,
  setIsSaving: null,
  uploadingImages: false,
  setUploadingImages: null,
  view: "layers",
  setView: null,
})

export default AppContext
