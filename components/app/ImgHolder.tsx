import React, { useContext } from "react"
import AppContext from "../../context/AppContext"

interface ImgHolderProps {
  attributes: any[]
  layers: any[]
}

const ImgHolder = ({ attributes, layers }: ImgHolderProps) => {
  const { settings } = useContext(AppContext)

  return (
    <div className="img-holder">
      {attributes?.map((attr: any) => (
        <img
          src={
            layers
              .find((l) => l.name === attr.trait_type)
              ?.images?.find((img: any) => img.name === attr.value)?.url
          }
        />
      ))}
      {settings && settings.watermarkUrl && (
        <img
          src={settings.watermarkUrl}
          className={`watermark ${settings.watermarkPos}`}
        />
      )}
    </div>
  )
}

export default ImgHolder
