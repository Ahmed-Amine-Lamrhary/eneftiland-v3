import React from "react"

interface ImgHolderProps {
  attributes: any[]
  layers: any[]
}

const ImgHolder = ({ attributes, layers }: ImgHolderProps) => {
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
    </div>
  )
}

export default ImgHolder
