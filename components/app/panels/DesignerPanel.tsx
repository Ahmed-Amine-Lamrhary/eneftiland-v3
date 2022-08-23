import React, { useContext } from "react"
import AppContext from "../../../context/AppContext"
import AppLoader from "../../AppLoader"
import LayerPanel from "../LayerPanel"
import LayersPanel from "../LayersPanel"
import PreviewItem from "../PreviewItem"

interface DesignerPanelProps {
  generate: any
}

const DesignerPanel = ({ generate }: DesignerPanelProps) => {
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
        <div className="pt-4 pb-4">
          <div className="row">
            <div className="col-lg-3">
              <LayersPanel />
            </div>

            <div className="col-lg-7 middle-section">
              <LayerPanel />
            </div>

            <div className="col-lg-2">
              <PreviewItem />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignerPanel
