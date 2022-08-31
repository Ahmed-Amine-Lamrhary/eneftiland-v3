import ImageKit from "imagekit"
import React, { useContext, useState } from "react"
import { AiOutlineCloudUpload, AiOutlinePlus } from "react-icons/ai"
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc"
import AppContext from "../../context/AppContext"
import { blendList } from "../../helpers/constants"
import { cleanName } from "../../helpers/generator"
import { showToast } from "../../helpers/utils"
import LayerI from "../../types/LayerI"
import Button from "../Button"
import Layer from "./Layer"

function LayersPanel() {
  const {
    collection,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    setUploadingFolder,
    uploadingImages,
    isSaving,
  } = useContext(AppContext)

  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "")
      ref.current.setAttribute("webkitdirectory", "")
    }
  }, [ref])

  const [value, setValue] = useState("")

  const layers = collection?.layers ? [...collection?.layers] : []

  const addLayer = (value: string) => {
    setLayers([
      ...layers,
      {
        id: Math.random().toString(16).slice(2),
        name: value,
        images: [],
        options: {
          bypassDNA: false,
          blend: blendList[0],
          opacity: 1,
        },
        totalPoints: 0,
      },
    ])
  }

  const removeLayer = async (e: any, id: string) => {
    e.stopPropagation()

    setActiveLayerId(null)
    setLayers(layers?.filter((layer) => layer.id !== id))
  }

  const selectLayer = (id: string) => {
    setActiveLayerId(id)
  }

  const SortableItem: any = SortableElement(({ name, id }: any) => (
    <Layer
      id={id}
      name={name}
      activeLayerId={activeLayerId}
      selectLayer={selectLayer}
      removeLayer={removeLayer}
    />
  ))

  const SortableList: any = SortableContainer(({ items }: any) => {
    return (
      <ul className="list-unstyled">
        {items.map(({ id, name }: LayerI, index: any) => (
          <SortableItem key={`item-${id}`} index={index} name={name} id={id} />
        ))}
      </ul>
    )
  })

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setLayers(arrayMove(layers, oldIndex, newIndex))
  }

  const onSubmit = () => {
    if (!value) return showToast("Please enter a layer name", "error")
    if (layers.map((layer) => layer.name).includes(value))
      return showToast("This name is already used", "error")

    addLayer(value)
    setValue("")
  }

  const uploadFolder = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingFolder(true)

      const acceptType = ["image/png", "image/jpeg", "image/svg+xml"]

      var files: any = event.target.files

      var imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || "",
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
      })

      const addedLayers: any = {}

      for (var i = 0; i < files.length; i++) {
        const file = files[i]
        if (!acceptType.includes(file.type)) continue

        let d = file.webkitRelativePath.split("/").slice(-2).join("/")
        const parentFolder = d.substr(0, d.indexOf("/"))

        // create layer
        addedLayers[parentFolder] = addedLayers[parentFolder]
          ? [...addedLayers[parentFolder], file]
          : [file]
      }

      const listLayers: any = []

      await Promise.all(
        Object.keys(addedLayers).map(async (layerName: any) => {
          const images = addedLayers[layerName]
          const listImages: any = []

          await Promise.all(
            images.map(async (image: any) => {
              const item: any = {
                id: Math.random().toString(16).slice(2),
                rarity: 50,
                name: cleanName(image.name),
                filename: image.name,
              }

              const { url } = await imagekit.upload({
                file: image,
                fileName: image.name,
              })

              item.url = url
              listImages.push(item)
            })
          )

          listLayers.push({
            id: Math.random().toString(16).slice(2),
            name: layerName,
            images: listImages,
            options: {
              bypassDNA: false,
              blend: blendList[0],
              opacity: 1,
            },
            totalPoints: listImages.length * 50,
          })
        })
      )

      if (listLayers.length === 0) {
        setUploadingFolder(false)
        return showToast("Folder uploaded is not valid", "error")
      }

      setLayers(listLayers)

      setUploadingFolder(false)
    } catch (error: any) {
      console.log(error)
      showToast(error.message, "error")
    }
  }

  return (
    <>
      <div className="sticky-panel">
        <div className="layers-panel">
          {/* upload folder */}
          <div className="text-center mb-4">
            <Button
              onClick={() => ref.current?.click()}
              className="btn-sm btn-white"
              disabled={uploadingImages}
            >
              <AiOutlineCloudUpload size={20} /> Upload folder
            </Button>

            <p className="paragraph" style={{ fontSize: "13px" }}>
              You can arrange the layers by shuffling them up or down
            </p>

            <input
              type="file"
              ref={ref}
              onChange={uploadFolder}
              style={{ display: "none" }}
            />
          </div>

          {/* manually */}
          <SortableList
            items={layers}
            onSortEnd={onSortEnd}
            lockOffset={["0%", "10%"]}
            distance={1}
          />

          <div className="app-layer add-layer">
            <input
              type="text"
              placeholder="New Layer"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key !== "Enter") return
                e.preventDefault()
                onSubmit()
              }}
              disabled={uploadingImages}
            />
            <button type="button" onClick={onSubmit} disabled={uploadingImages}>
              <AiOutlinePlus size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LayersPanel
