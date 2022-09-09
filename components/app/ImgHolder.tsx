import { useSession } from "next-auth/react"
import React, { useContext } from "react"
import AppContext from "../../context/AppContext"

interface ImgHolderProps {
  attributes: any[]
  layers: any[]
}

const ImgHolder = ({ attributes, layers }: ImgHolderProps) => {
  const { settings } = useContext(AppContext)
  const { data: session }: any = useSession()

  return (
    <div className="img-holder">
      {attributes?.map((attr: any) => {
        const url = layers
          .find((l) => l.name === attr.trait_type)
          ?.images?.find((img: any) => img.name === attr.value)?.url

        return <img src={url} />
      })}

      {settings && settings.watermarkUrl && !session?.user?.lifetime && (
        <img
          src={settings.watermarkUrl}
          className={`watermark ${settings.watermarkPos}`}
        />
      )}
    </div>
  )
}

export default ImgHolder
