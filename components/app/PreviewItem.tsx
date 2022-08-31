import { useRouter } from "next/router"
import React, { useContext } from "react"
import { MdOutlineCollections } from "react-icons/md"
import AppContext from "../../context/AppContext"
import Button from "../Button"

const PreviewItem = () => {
  const { collection, setView, results }: any = useContext(AppContext)
  const layers = collection?.layers ? [...collection?.layers] : []
  const router = useRouter()

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

        {results && results.length > 0 && (
          <div className="text-center mt-3">
            <Button
              className="btn-sm btn-outline"
              onClick={() => {
                router.push(
                  {
                    pathname: `/app/${collection?.id}`,
                    query: { page: "gallery" },
                  },
                  undefined,
                  { scroll: false }
                )
                setView("gallery")
              }}
            >
              Preview more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewItem
