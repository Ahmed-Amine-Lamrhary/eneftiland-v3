import React, { useContext, useEffect, useState } from "react"
import { AiOutlineReload } from "react-icons/ai"
import AppContext from "../../../context/AppContext"
import Button from "../../Button"
import FiltersPanel from "../FiltersPanel"
import ResultsItem from "../ResultsItem"
import InfiniteScroll from "react-infinite-scroll-component"
import NoDataFound from "../../NoDataFound"
import swal from "sweetalert2"
import {
  callApi,
  millisToMinutesAndSeconds,
  showToast,
} from "../../../helpers/utils"
import { parseResults } from "../../../services/parser"
import { useRouter } from "next/router"
import { startCreating } from "../../../helpers/generator"

const STEP = 20

const GalleryPanel = () => {
  const {
    filteredItems,
    results,
    collection,
    setFilteredItems,
    loading,
    setLoading,
    setCollection,
    setResults,
    setView,
    setIsSaving,
  }: any = useContext(AppContext)

  const router = useRouter()
  const { id: collectionId } = router.query

  const [generationTime, setGenerationTime] = useState<string>("")

  const [count, setCount] = useState({
    prev: 0,
    next: STEP,
  })
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState(
    filteredItems?.slice(count.prev, count.next)
  )

  useEffect(() => {
    if (loading) {
      setHasMore(true)
      setCount({
        prev: 0,
        next: STEP,
      })
      setCurrent(
        Array.from(Array(collection?.collectionSize).keys()).slice(0, STEP)
      )
    } else {
      setCurrent(filteredItems?.slice(count.prev, count.next))
    }
  }, [loading])

  useEffect(() => {
    setHasMore(true)
    setCount({
      prev: 0,
      next: STEP,
    })
    setCurrent(filteredItems?.slice(0, STEP))
  }, [filteredItems])

  const getMoreData = () => {
    if (current.length === filteredItems.length) {
      setHasMore(false)
      return
    }
    setCurrent(
      current.concat(filteredItems.slice(count.prev + STEP, count.next + STEP))
    )
    setCount((prevState) => ({
      prev: prevState.prev + STEP,
      next: prevState.next + STEP,
    }))
  }

  const sortBy = (e: any) => {
    const value = e.target.value

    const sorted = filteredItems.slice().sort((item1: any, item2: any) => {
      if (value === "name") return item1.itemIndex - item2.itemIndex
      return item1.totalRarity - item2.totalRarity
    })

    setFilteredItems(sorted)
  }

  const updateResults = async (resultsString: string) => {
    try {
      setIsSaving(true)

      const currentCollection: any = {
        results: resultsString,
        galleryLayers: JSON.stringify(collection?.layers),
      }

      const { data } = await callApi({
        route: "me/updatecollection",
        body: {
          id: collectionId,
          currentCollection,
        },
      })

      if (!data.success) return showToast(data.message, "error")
    } catch (error: any) {
      showToast(error.message, "error")
    } finally {
      setIsSaving(false)
    }
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
          collection,
        },
      })

      const { success, data, message } = generatedData

      if (!success) {
        setLoading(false)
        showToast(message, "error")
        return
      }

      const resultsString = data?.metadata
        .map((i: any) => {
          const attrs = i.attributes.map((a: any) => {
            const layer = collection?.layers?.find(
              (l: any) => l.name === a.trait_type
            )
            const layerIndex = collection?.layers?.findIndex(
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

      const resultsData = parseResults(collection, resultsString, true)

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

      // generation time
      setGenerationTime(millisToMinutesAndSeconds(data?.genTime))

      setResults(resultsData)

      // update results
      await updateResults(resultsString)
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
          {generationTime && (
            <div className="options-bar text-center mb-4">
              <div className="container">
                <p className="paragraph">Generation Time: {generationTime}</p>
              </div>
            </div>
          )}

          <div className="collections-block">
            <div className="d-flex justify-content-end">
              <div className="form-group">
                <select className="form-select" onChange={sortBy}>
                  <option value="name">Item index</option>
                  <option value="rarity">Rarity score</option>
                </select>
              </div>
            </div>

            <div className="row">
              {/* Filter */}
              <div className="col-md-3 col-sm-4">
                <FiltersPanel loading={loading} generate={generate} />
              </div>

              <div className="col-md-9 col-sm-8">
                <InfiniteScroll
                  dataLength={current?.length}
                  next={getMoreData}
                  hasMore={hasMore}
                  loader={null}
                >
                  <div className="row">
                    {!current ||
                      (current.length === 0 && (
                        <>
                          <NoDataFound phrase="No items were found" />
                        </>
                      ))}
                    {current &&
                      current.map((item: any, index: any) => (
                        <div
                          className="col-xxl-2 col-md-3 col-6"
                          key={`result-item-${index}`}
                        >
                          <ResultsItem
                            item={item}
                            loading={loading}
                            index={index}
                          />
                        </div>
                      ))}
                  </div>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPanel
