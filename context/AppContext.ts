import React from "react"
import CollectionI from "../types/CollectionI"

interface AppContextInterface {
  collection: CollectionI | null
  setCollection: any
  setLayers: any
  activeLayerId: string | null
  setActiveLayerId: any
  loading: boolean
  setLoading: any
  setResults: any
  addToResults: any
  view: "designer" | "settings" | "rules" | "preview" | "generate"
  setView: any
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
}

const AppContext = React.createContext<AppContextInterface>({
  collection: null,
  setCollection: null,
  setLayers: null,
  activeLayerId: null,
  setActiveLayerId: null,
  loading: false,
  setResults: null,
  addToResults: null,
  view: "designer",
  setView: null,
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
})

export default AppContext
