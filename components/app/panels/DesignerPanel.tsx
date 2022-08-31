import React from "react"
import LayerPanel from "../LayerPanel"
import LayersPanel from "../LayersPanel"
import PreviewItem from "../PreviewItem"

const DesignerPanel = () => {
  return (
    <div className="designer">
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
