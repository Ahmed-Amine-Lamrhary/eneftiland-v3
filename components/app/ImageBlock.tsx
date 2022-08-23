import React, { useContext, useState } from "react"
import { BiPencil } from "react-icons/bi"
import { IoMdClose } from "react-icons/io"
import AppContext from "../../context/AppContext"
import RangeBox from "./RangeBox"

interface ImageBlockProps {
  image: any
  index: number
  onImageRemove: any
  onImageUpdate: any
  onChange: any
  newImageList: any
  changeImageName: any
}

const ImageBlock = ({
  image,
  index,
  onImageRemove,
  onImageUpdate,
  onChange,
  newImageList,
  changeImageName,
}: ImageBlockProps) => {
  const { collection, activeLayerId } = useContext(AppContext)
  const layers = collection?.layers ? [...collection?.layers] : []
  const activeLayer = layers.find((layer) => layer.id === activeLayerId)

  const totalPoints: any = activeLayer?.totalPoints

  return (
    <div className="image-item box">
      <img src={image.url} alt="" className="img-fluid" />
      <div className="btn-wrapper">
        <button className="remove" onClick={() => onImageRemove(index)}>
          <IoMdClose />
        </button>
        <button className="update" onClick={() => onImageUpdate(index)}>
          <BiPencil />
        </button>
      </div>
      <span className="rarity-value box">
        {((image.rarity * 100) / totalPoints).toFixed(1)}%
      </span>

      <input
        type="text"
        value={image.name}
        onChange={(e) => changeImageName(index, e.target.value)}
      />

      <RangeBox
        min={1}
        max={100}
        value={image.rarity}
        step={1}
        onChange={(e: any) => {
          onChange(newImageList, index, parseFloat(e.target.value), true)
        }}
      />

      <div className="d-flex justify-content-between rare-common">
        <span>Rare</span>
        <span>Common</span>
      </div>

      {activeLayer?.isAdvanced && (
        <div className="rarity-points">
          <input
            type="number"
            min={1}
            max={10000}
            value={image.rarity}
            style={{ width: 100 }}
            onChange={(e: any) =>
              onChange(newImageList, index, parseFloat(e.target.value), true)
            }
          />
          <span>of {totalPoints}</span>
        </div>
      )}
    </div>
  )
}

export default ImageBlock
