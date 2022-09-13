import React, { useContext, useState } from "react"
import AppContext from "../../../context/AppContext"
import Button from "../../Button"
import FiltersPanel from "../FiltersPanel"
import ResultsItem from "../ResultsItem"
import NoDataFound from "../../NoDataFound"
import swal from "sweetalert2"
import { callApi, handleSortResults, showToast } from "../../../helpers/utils"
import { useRouter } from "next/router"
import { IoCloseOutline } from "react-icons/io5"
import { AiOutlineReload } from "react-icons/ai"
import { VirtuosoGrid } from "react-virtuoso"
import { RiLayoutGridLine } from "react-icons/ri"

interface GalleryPanelProps {
  isReadonly?: boolean
}

const GalleryPanel = ({ isReadonly = false }: GalleryPanelProps) => {
  const {
    filteredItems,
    results,
    collection,
    setFilteredItems,
    loading,
    setLoading,
    setResults,
    setView,
    setCollection,
  }: any = useContext(AppContext)

  const layers = collection?.galleryLayers ? [...collection?.galleryLayers] : []

  const router = useRouter()

  const resetedFilters = () => {
    const f: any = {}
    layers.forEach((layer) => {
      f[layer.name] = []
    })
    return f
  }

  const [filters, setFilters] = useState<any>(resetedFilters())

  const [sortBy, setSortBy] = useState<"index" | "rarity">("index")

  const handleSort = (e: any) => {
    setSortBy(e.target.value)
    const sorted = handleSortResults(filteredItems, e.target.value)
    setFilteredItems(sorted)
  }

  const generate = async (ignoreWarning: boolean) => {
    try {
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

      // generating
      const { data: generatedData } = await callApi({
        route: "generate",
        body: {
          collectionId: collection.id,
        },
      })

      const { success, message, data } = generatedData

      if (!success) {
        setLoading(false)
        showToast(message, "error")
        return
      }

      if (!ignoreWarning) {
        router.push(
          {
            pathname: `/app/${collection?.id}`,
            query: { page: "gallery" },
          },
          undefined,
          { scroll: false }
        )
        setView("gallery")
      }

      setCollection({
        ...collection,
        galleryLayers: [...collection.layers],
      })
      setSortBy("index")
      setResults(data)
      setFilteredItems(data)
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      // if (error.name !== "ValidationError") setError(error)

      showToast(error.message, "error")
      if (!ignoreWarning) {
        router.push(
          {
            pathname: `/app/${collection?.id}`,
            query: { page: "gallery" },
          },
          undefined,
          { scroll: false }
        )
        setView("gallery")
      }
      setLoading(false)
    }
  }

  // Error
  if (!results)
    return (
      <div className="results-panel">
        <header className="text-center mb-3">
          <h3>An Error Occured</h3>
          <p className="paragraph">Please try again</p>
        </header>

        {/* show collections */}
        <div className="collection-images">
          <div className="options-bar text-center">
            <div className="container">
              <Button theme="white" onClick={generate} className="me-3 btn-sm">
                <AiOutlineReload /> Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )

  // Show Data
  return (
    <div className="results-panel">
      {/* show items */}
      <div className="collection-images">
        <div className="container-fluid">
          {/* {generationTime && (
            <div className="options-bar text-center mb-4">
              <div className="container">
                <p className="paragraph">Generation Time: {generationTime}</p>
              </div>
            </div>
          )} */}

          <div className="collections-block">
            <div className="row">
              {/* Filter */}
              <div className="col-lg-2 col-md-3 col-sm-4">
                <FiltersPanel
                  loading={loading}
                  filters={filters}
                  resetedFilters={resetedFilters}
                  setFilters={setFilters}
                  sortBy={sortBy}
                />
              </div>

              <div className="col-lg-10 col-md-9 col-sm-8">
                {/* filters */}
                <div className="d-md-flex justify-content-between mb-3">
                  <div className="d-flex align-items-center mt-2 mt-md-0">
                    <p className="m-0 me-3 paragraph">
                      {filteredItems?.length} item
                      {filteredItems?.length !== 1 ? "s" : ""}
                    </p>

                    {filteredItems?.length !== results.length && (
                      <Button
                        theme="white"
                        className="btn-sm me-3"
                        onClick={() => setFilters(resetedFilters())}
                      >
                        <IoCloseOutline /> Clear filters
                      </Button>
                    )}

                    {!isReadonly && (
                      <Button
                        className="btn-sm"
                        onClick={() => generate(false)}
                        disabled={loading}
                      >
                        <AiOutlineReload /> Regenerate
                      </Button>
                    )}
                  </div>

                  {/* <div className="form-group m-0 mt-3 mt-md-0">
                    <select
                      className="form-select"
                      onChange={handleSort}
                      value={sortBy}
                    >
                      <option value="index">Item index</option>
                      <option value="rarity">Rarity score</option>
                    </select>
                  </div> */}
                </div>

                {filteredItems.length === 0 ? (
                  <NoDataFound
                    phrase="No items were found"
                    Icon={RiLayoutGridLine}
                  />
                ) : (
                  <VirtuosoGrid
                    useWindowScroll
                    overscan={1000}
                    totalCount={filteredItems.length}
                    itemContent={(index) => (
                      <div key={`result-item-${index}`}>
                        <ResultsItem
                          item={filteredItems[index]}
                          loading={loading}
                          index={index}
                        />
                      </div>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPanel
