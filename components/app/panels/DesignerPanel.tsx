import React, { useContext } from "react"
import AppContext from "../../../context/AppContext"
import AppLoader from "../../AppLoader"
import LayerPanel from "../LayerPanel"
import LayersPanel from "../LayersPanel"
import PreviewItem from "../PreviewItem"

const DesignerPanel = () => {
  const { uploadingFolder } = useContext(AppContext)

  return (
    <div className="designer">
      {uploadingFolder && (
        <div className="uploading-folder text-center d-flex justify-content-center align-items-center">
          <div>
            <AppLoader />
            <p className="paragraph">Uploading your images...</p>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="pb-4">
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <LayersPanel />
            </div>
            <div className="col-md-2 col-sm-6 mb-3">
              <PreviewItem />
            </div>
            <div className="col-md-7 middle-section">
              <LayerPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignerPanel
