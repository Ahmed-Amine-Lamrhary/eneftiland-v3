import React, { useContext, useEffect, useState } from "react"
import { AiOutlineReload } from "react-icons/ai"
import AppContext from "../../../context/AppContext"
import Button from "../../Button"
import FiltersPanel from "../FiltersPanel"
import ResultsItem from "../ResultsItem"
import InfiniteScroll from "react-infinite-scroll-component"
import NoDataFound from "../../NoDataFound"

interface PreviewPanelProps {
  setError: any
  generate: any
  generationTime: string
  loading?: boolean
}

const PreviewPanel = ({
  setError,
  generate,
  generationTime,
  loading,
}: PreviewPanelProps) => {
  const { filteredItems, results, collection, setFilteredItems }: any =
    useContext(AppContext)

  const [count, setCount] = useState({
    prev: 0,
    next: 10,
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
        next: 10,
      })
      setCurrent(
        Array.from(Array(collection?.collectionSize).keys()).slice(0, 10)
      )
    } else {
      setCurrent(filteredItems?.slice(count.prev, count.next))
    }
  }, [loading])

  useEffect(() => {
    setHasMore(true)
    setCount({
      prev: 0,
      next: 10,
    })
    setCurrent(filteredItems?.slice(0, 10))
  }, [filteredItems])

  const getMoreData = () => {
    if (current.length === filteredItems.length) {
      setHasMore(false)
      return
    }
    setCurrent(
      current.concat(filteredItems.slice(count.prev + 10, count.next + 10))
    )
    setCount((prevState) => ({
      prev: prevState.prev + 10,
      next: prevState.next + 10,
    }))
  }

  const sortBy = (e: any) => {
    const value = e.target.value

    const sorted = filteredItems.slice().sort((item1: any, item2: any) => {
      if (value === "name") return item1.itemIndex - item2.itemIndex
      else if (value === "rarity") return item1.totalRarity - item2.totalRarity
    })

    setFilteredItems(sorted)
  }

  // Error
  if (!results)
    return (
      <div className="results-panel">
        <header className="text-center">
          <h3 className="mb-3">An Error Occured</h3>
          <h6>Please try again</h6>
        </header>

        {/* show collections */}
        <div className="collection-images">
          <div className="options-bar text-center mb-3">
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
          <div className="options-bar text-center mb-4">
            <div className="container">
              {generationTime && (
                <p className="paragraph">Generation Time: {generationTime}</p>
              )}
            </div>
          </div>

          <div className="collections-block">
            <div className="row justify-content-end">
              <div className="form-group col-2">
                <select className="form-select" onChange={sortBy}>
                  <option value="name">Item index</option>
                  <option value="rarity">Rarity score</option>
                </select>
              </div>
            </div>

            <div className="row">
              {/* Filter */}
              <div className="col-3">
                <FiltersPanel loading={loading} generate={generate} />
              </div>

              <div className="col-9">
                <InfiniteScroll
                  dataLength={current.length}
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
                          className="col-md-3 col-6"
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

export default PreviewPanel
