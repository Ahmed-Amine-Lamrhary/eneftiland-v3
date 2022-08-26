import React, { useContext, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { AiOutlineReload } from "react-icons/ai"
import AppContext from "../../context/AppContext"
import Button from "../Button"

const FiltersPanel = ({ loading, generate }: any) => {
  const { collection, filteredItems, setFilteredItems, results } =
    useContext(AppContext)
  const layers = collection?.galleryLayers ? [...collection?.galleryLayers] : []

  useEffect(() => {
    setFilters(resetedFilters())
  }, [results])

  const resetedFilters = () => {
    const f: any = {}
    layers.forEach((layer) => {
      f[layer.name] = []
    })
    return f
  }
  const [filters, setFilters] = useState<any>(resetedFilters())

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
          const items = results?.filter(
            (item: any) =>
              item.attributes.some(
                (attr: any) =>
                  attr.trait_type === layerName &&
                  filters[layerName].includes(attr.value)
              ) &&
              !newResults.some((colItem: any) => colItem.name === item.name)
          )

          newResults.push(...items)
        }
      }
    } else {
      newResults = [...results]
    }

    setFilteredItems(newResults)
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
    <div className={`filter-panel mb-4 ${loading ? "disabled" : ""}`}>
      <h6 className="title">
        Filters: {filteredItems.length} item
        {filteredItems.length !== 1 ? "s" : ""}
      </h6>

      <div className="btns mb-3">
        <Button
          className="btn-sm"
          onClick={() => generate(false)}
          disabled={loading}
        >
          <AiOutlineReload /> Regenerate
        </Button>

        {filteredItems.length !== results.length && (
          <Button
            theme="white"
            className="mt-2 btn-sm"
            onClick={() => setFilters(resetedFilters())}
          >
            Reset Filters
          </Button>
        )}
      </div>

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
