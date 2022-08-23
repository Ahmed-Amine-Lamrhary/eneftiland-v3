import React, { useContext, useState } from "react"
import { Modal, Tab, Tabs } from "react-bootstrap"
import AppContext from "../../context/AppContext"
import AppModal from "../AppModal"
import ImgHolder from "./ImgHolder"
import MetadataPreview from "./MetadataPreview"

interface ResultsItemProps {
  item: any
  loading?: boolean
  index: number
}

const ResultsItem = ({ item, loading, index }: ResultsItemProps) => {
  const { collection, results } = useContext(AppContext)
  const layers = collection?.layers ? [...collection?.layers] : []
  const [showDetails, setShowDetails] = useState<boolean>(false)

  return (
    <>
      <AppModal show={showDetails} onHide={() => setShowDetails(false)}>
        <div className="row">
          {/* Item preview */}
          <div className="col-5">
            <ImgHolder attributes={item?.attributes} layers={layers} />
          </div>

          {/* Item details */}
          <div className="col-7 preview-item">
            <p>{collection?.collectionName}</p>
            {item?.itemIndex !== undefined && (
              <h3>
                {collection?.prefix || collection?.collectionName} #
                {item.itemIndex ? item.itemIndex + 1 : 1}
              </h3>
            )}

            {/* properties and metadata */}
            <Tabs defaultActiveKey="properties" id="properties-metadata">
              <Tab eventKey="properties" title="Properties">
                <div className="row">
                  {item?.attributes?.map((attr: any) => {
                    const total = results.filter((r: any) =>
                      r.attributes.some((a: any) => a.value === attr.value)
                    ).length

                    return (
                      <div className="col-4">
                        <div className="attribute-details">
                          <p>{attr.trait_type}</p>
                          <h6>{attr.value}</h6>
                          <p>
                            {((total * 100) / results.length).toFixed(2)}% have
                            this
                            <br />
                            {total} total
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Tab>

              <Tab eventKey="metadata" title="Metadata">
                <MetadataPreview item={item} index={index} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </AppModal>

      <div
        className="collection-block mb-4"
        onClick={() => {
          if (!loading) setShowDetails(true)
        }}
      >
        {loading ? (
          <div>
            <div className="img-holder loading-img-holder" />
          </div>
        ) : (
          <>
            <ImgHolder attributes={item?.attributes} layers={layers} />

            {item?.itemIndex !== undefined && (
              <div className="collection-name">
                {collection?.prefix || collection?.collectionName} #
                {item.itemIndex ? item.itemIndex + 1 : 1}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ResultsItem
