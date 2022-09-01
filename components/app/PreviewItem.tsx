import React, { useContext } from "react"
import { MdOutlineCollections } from "react-icons/md"
import AppContext from "../../context/AppContext"

const PreviewItem = () => {
  const { collection }: any = useContext(AppContext)
  const layers = collection?.layers ? [...collection?.layers] : []

  return (
    <div className="sticky-panel">
      <h6>Preview</h6>

      <div className="collection-block preview">
        <div className="img-container">
          <div className="img-holder">
            {!layers || layers.length === 0 ? null : (
              <>
                {layers
                  .slice()
                  .reverse()
                  ?.map((layer) => {
                    return <img src={layer.images[0]?.url} draggable={false} />
                  })}
              </>
            )}
          </div>

          {!layers ||
            (layers.length === 0 && (
              <div className="icon">
                <MdOutlineCollections size={60} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PreviewItem
