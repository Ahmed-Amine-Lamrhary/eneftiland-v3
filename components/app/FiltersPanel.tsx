import React, { useContext, useEffect } from "react"
import { Accordion } from "react-bootstrap"
import AppContext from "../../context/AppContext"
import { handleSortResults } from "../../helpers/utils"

interface FiltersPanelProps {
  loading: any
  filters: any
  setFilters: any
  resetedFilters: any
  sortBy: "index" | "rarity"
}

const FiltersPanel = ({
  loading,
  filters,
  setFilters,
  resetedFilters,
  sortBy,
}: FiltersPanelProps) => {
  const { collection, setFilteredItems, results } = useContext(AppContext)
  const layers = collection?.galleryLayers ? [...collection?.galleryLayers] : []

  useEffect(() => {
    setFilters(resetedFilters())
  }, [results])

  useEffect(() => {
    let newResults: any = []

    let filtersEmpty = true
    for (const layerName in filters) {
      if (filters[layerName].length > 0) {
        filtersEmpty = false
        break
      }
    }

    if (!filtersEmpty) {
      for (const layerName in filters) {
        if (filters[layerName].length > 0) {
          const items = results?.filter((item: any) =>
            item.attributes.some(
              (attr: any) =>
                attr.trait_type === layerName &&
                filters[layerName].includes(attr.value)
            )
          )

          newResults.push(...items)
        }
      }
    } else {
      newResults = [...results]
    }

    const sorted = handleSortResults(newResults, sortBy)
    setFilteredItems(sorted)
  }, [filters])

  const handleFilter = (e: any, layerName: string) => {
    const newFilters: any = { ...filters }
    if (e.target.checked)
      newFilters[layerName] = [...filters[layerName], e.target.name]
    else
      newFilters[layerName] = newFilters[layerName].filter(
        (imageName: string) => imageName !== e.target.name
      )

    setFilters(newFilters)
  }

  return (
    <div className={`filter-panel ${loading ? "disabled" : ""}`}>
      <Accordion className="accordion" alwaysOpen>
        {layers.map((layer) => (
          <Accordion.Item eventKey={layer.name}>
            <Accordion.Header>{layer.name}</Accordion.Header>
            <Accordion.Body>
              <ul>
                {layer.images?.map((image, index) => {
                  return (
                    <li>
                      <div>
                        <input
                          type="checkbox"
                          name={image.name}
                          id={image.name + index}
                          onChange={(e) => handleFilter(e, layer.name)}
                          checked={filters[layer.name]?.includes(image.name)}
                        />
                        <label htmlFor={image.name + index}>{image.name}</label>
                      </div>

                      <p>
                        {
                          results.filter((r: any) =>
                            r.attributes.some(
                              (attr: any) => attr.id === image.id
                            )
                          ).length
                        }
                      </p>
                    </li>
                  )
                })}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

export default FiltersPanel
