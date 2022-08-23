import React, { useContext } from "react"
import { IoCloseOutline } from "react-icons/io5"
import AppContext from "../../context/AppContext"

interface LayerProps {
  id: string
  name: string
  activeLayerId: string | null | undefined
  selectLayer: any
  removeLayer: any
}

function Layer({
  id,
  name,
  activeLayerId,
  selectLayer,
  removeLayer,
}: LayerProps) {
  const { uploadingImages } = useContext(AppContext)

  return (
    <li
      className={`d-flex align-items-center app-layer ${
        id === activeLayerId ? "active" : ""
      } ${uploadingImages ? "disabled" : ""}`}
      onClick={() => selectLayer(id)}
    >
      <div className="layer-name">{name}</div>
      <div>
        <button
          className="remove-btn"
          onClick={(e) => removeLayer(e, id)}
          disabled={uploadingImages}
        >
          <IoCloseOutline />
        </button>
      </div>
    </li>
  )
}

export default Layer
