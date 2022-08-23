import React, { useCallback, useContext, useEffect, useState } from "react"
import AppContext from "../../context/AppContext"
import { millisToMinutesAndSeconds, showToast } from "../../helpers/utils"
import axios from "axios"
import { useRouter } from "next/router"
import debounce from "lodash.debounce"
import swal from "sweetalert2"

import GeneratePanel from "./panels/GeneratePanel"
import SettingsPanel from "./panels/SettingsPanel"
import PreviewPanel from "./panels/PreviewPanel"
import DesignerPanel from "./panels/DesignerPanel"
import RulesPanel from "./panels/RulesPanel"
import { parseResults } from "../../services/parser"
import AppNavbar from "./panels/AppNavbar"

const Application = ({ settings, plans }: any) => {
  const router = useRouter()
  const { id: collectionId }: any = router.query

  const {
    collection,
    loading,
    setLoading,
    setResults,
    results,
    view,
    setView,
    setIsSaving,
  }: any = useContext(AppContext)

  const [count, setCount] = useState<number>(0)

  const [error, setError] = useState<any>(null)

  const [generationTime, setGenerationTime] = useState<string>("")

  const verify = useCallback(
    debounce((layers) => {
      updateLayers(layers)
    }, 1000),
    []
  )

  // paypal
  useEffect(() => {
    if (settings) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${settings.paypalClientId}`
      document.body.appendChild(script)
    }
  }, [])

  // rarity score
  useEffect(() => {
    results.map((item: any) => {
      const sum = item.attributes.reduce((p: any, a: any) => {
        return p + a.rarity
      }, 0)
      item["totalRarity"] = sum
      return item
    })
  }, [results])
  //

  useEffect(() => {
    if (count > 0) verify(collection?.layers)
    setCount(count + 1)
  }, [collection?.layers])

  const updateLayers = async (layers: any) => {
    try {
      setIsSaving(true)

      const currentCollection: any = {
        layers: JSON.stringify(layers),
      }

      const { data } = await axios.post("/api/me/updatecollection", {
        id: collectionId,
        currentCollection,
      })

      if (!data.success) return showToast(data.message, "error")

      await generate(true, layers)
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const updateResults = async (resultsString: string) => {
    try {
      setIsSaving(true)

      const currentCollection: any = {
        results: resultsString,
      }

      const { data } = await axios.post("/api/me/updatecollection", {
        id: collectionId,
        currentCollection,
      })

      if (!data.success) return showToast(data.message, "error")
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const generate = async (ignoreWarning: boolean, layers?: any) => {    
    const collectionD = {
      ...collection,
      layers: layers ? layers : collection.layers,
    }

    try {
      // validation
      // await layersSchema.validate({
      //   layers: collectionD?.layers,
      // })

      if (!ignoreWarning && results && results.length > 0) {
        const willRegenerate = await swal.fire({
          title: "Are you sure?",
          text: "Your current data will be lost",
          icon: "warning",
          confirmButtonText: "Yes, Regenerate",
          cancelButtonText: "No, Cancel",
          showCancelButton: true,
          showCloseButton: true,
        })

        if (!willRegenerate.isConfirmed) return
      }

      if (!ignoreWarning) window.scrollTo(0, 0)

      setLoading(true)

      const { data: generatedData } = await axios.post("/api/generate", {
        collection: collectionD,
      })

      const { success, data, message } = generatedData

      if (!success) {
        setLoading(false)
        return showToast(message, "error")
      }

      const resultsString = data.metadata
        .map((i: any) => {
          const attrs = i.attributes.map((a: any) => {
            const layer = collectionD?.layers?.find(
              (l: any) => l.name === a.trait_type
            )
            const layerIndex = collectionD?.layers?.findIndex(
              (l: any) => l.name === a.trait_type
            )
            const imageIndex = layer?.images?.findIndex(
              (img: any) => img.name === a.value
            )

            return `${layerIndex}+${imageIndex}`
          })
          return attrs.join(",")
        })
        .join("|")
      const resultsData = parseResults(collectionD, resultsString)

      setResults(resultsData)
      if (!ignoreWarning) setView("preview")
      setLoading(false)

      // generation time
      setGenerationTime(millisToMinutesAndSeconds(data.genTime))

      // update results
      await updateResults(resultsString)

      // setCollection({ ...collection, results: resultsData })
    } catch (error: any) {
      console.log(error)
      if (error.name !== "ValidationError") setError(error)

      showToast(error.message, "error")
      if (!ignoreWarning) setView("preview")
      setLoading(false)
    }
  }

  return (
    <>
      <div className="app-panel">
        <AppNavbar />

        <div className="app-container">
          {/* Designer */}
          {view === "designer" && <DesignerPanel generate={generate} />}

          {/* Settings */}
          {view === "settings" && <SettingsPanel />}

          {/* Rules */}
          {view === "rules" && <RulesPanel />}

          {/* Results */}
          {view === "preview" && (
            <PreviewPanel
              setError={setError}
              generate={generate}
              generationTime={generationTime}
              loading={loading}
            />
          )}

          {/* Generate */}
          {view === "generate" && <GeneratePanel plans={plans} />}
        </div>
      </div>
    </>
  )
}

export default Application
