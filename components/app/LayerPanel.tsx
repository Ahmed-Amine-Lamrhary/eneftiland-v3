import React, { useContext, useEffect, useState } from "react"
import AppContext from "../../context/AppContext"
import ImagesUploader from "./ImagesUploader"
import FormControl from "./FormControl"
import CheckBox from "./CheckBox"
import { showToast } from "../../helpers/utils"
import { cleanName } from "../../helpers/generator"
import ImageKit from "imagekit"
import { AiOutlineLoading } from "react-icons/ai"
import { FiLayers } from "react-icons/fi"

function LayerPanel() {
  const {
    activeLayerId,
    collection,
    setLayers,
    uploadingImages,
    setUploadingImages,
  } = useContext(AppContext)
  const [updateTotalPoints, setUpdateTotalPoints] = useState(false)

  const layers = collection?.layers ? [...collection?.layers] : []

  const activeLayer = layers.find((layer) => layer.id === activeLayerId)

  const [layerNameError, setLayerNameError] = useState("")

  const changeName = async (value: string) => {
    try {
      // layer name is required
      if (!value) return setLayerNameError("Layer name is required")

      // layer name is unique
      if (layers.find((l) => l.name === value))
        return setLayerNameError("Layer name should be unique")

      setLayerNameError("")

      const newLayers = [...layers]
      const index = newLayers.findIndex((layer) => layer.id === activeLayerId)

      newLayers[index].name = value

      setLayers([...newLayers])
    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  const changeImageName = (index: number, value: string) => {
    if (!value) return

    const newLayers = [...layers]
    const layerIndex = newLayers.findIndex(
      (layer) => layer.id === activeLayerId
    )
    const list: any = newLayers[layerIndex].images
    list[index].name = value

    newLayers[layerIndex].images = [...list]

    setLayers([...newLayers])
  }

  const changeImages = async (
    newImageList: any,
    addUpdateIndex: any,
    rarity: number,
    dontUpload?: boolean
  ) => {
    setUploadingImages(true)

    var imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    })

    const list: any = []
    const newLayers = [...layers]
    const index = newLayers.findIndex((layer) => layer.id === activeLayerId)
    const layer: any = layers.find((layer) => layer.id === activeLayerId)

    await Promise.all(
      newImageList?.map(async (e: any, index: number) => {
        const item: any = {}
        const currentImage = layer?.images.find((im: any) => im.name === e.name)

        // rarity
        if (rarity) {
          if (addUpdateIndex === index) {
            item.rarity = parseFloat(rarity.toFixed(1)) ? rarity : 0
          } else {
            item.rarity = currentImage.rarity
          }
        } else {
          if (!currentImage?.rarity) item.rarity = 50
          else item.rarity = currentImage.rarity
        }

        // name
        item.name = e?.file?.name ? cleanName(e.file.name) : currentImage.name

        // filename
        item.filename = e?.file?.name ? e.file.name : currentImage.filename

        // upload image and get its url
        if (!dontUpload) {
          if ("file" in e) {
            const { url } = await imagekit.upload({
              file: e.file,
              fileName: e.file.name,
            })

            item.url = url
          } else {
            item.url = currentImage.url
          }
        } else {
          item.url = currentImage.url
        }

        // item id
        item.id = Math.random().toString(16).slice(2)

        list.push(item)
      })
    )

    newLayers[index].images = [...list]
    setLayers([...newLayers])

    setUpdateTotalPoints(true)
    setUploadingImages(false)
  }

  useEffect(() => {
    if (updateTotalPoints && layers.length > 0) {
      const newLayers = [...layers]
      const index = newLayers.findIndex((layer) => layer.id === activeLayerId)

      if (index >= 0) {
        let newTotalPoints = 0
        activeLayer?.images?.map((img) => {
          newTotalPoints += img.rarity
        })

        newLayers[index].totalPoints = Number.parseInt(
          newTotalPoints.toFixed(0)
        )
        setLayers([...newLayers])
      }

      setUpdateTotalPoints(false)
    }
  }, [updateTotalPoints])

  const toggleDNA = (e: any) => {
    const newLayers = [...layers]
    const index = newLayers.findIndex((layer) => layer.id === activeLayerId)
    newLayers[index].options.bypassDNA = e.target.checked
    setLayers([...newLayers])
  }

  const chooseBlend = (e: any) => {
    const newLayers = [...layers]
    const index = newLayers.findIndex((layer) => layer.id === activeLayerId)
    newLayers[index].options.blend = e.target.value
    setLayers([...newLayers])
  }

  const changeOpacity = (e: any) => {
    const newLayers = [...layers]
    const index = newLayers.findIndex((layer) => layer.id === activeLayerId)
    newLayers[index].options.opacity = parseFloat(e.target.value)
    setLayers([...newLayers])
  }

  const toggleIsAdvanced = (e: any) => {
    const newLayers = [...layers]
    const index = newLayers.findIndex((layer) => layer.id === activeLayerId)
    newLayers[index].isAdvanced = e.target.checked
    setLayers([...newLayers])
  }

  if (!activeLayerId || layers.length === 0)
    return (
      <div className="text-center">
        <FiLayers size={50} color="rgba(27, 22, 66, 0.6)" />
        <h5 className="mt-3">No layer selected</h5>
        <p className="paragraph">
          Add layers manually or choose a folder to get started
        </p>
      </div>
    )

  return (
    <div>
      <h6>Attributes</h6>

      {/* Name */}
      <CheckBox
        checked={activeLayer?.isAdvanced}
        onCheck={toggleIsAdvanced}
        label="Show advanced"
        disabled={uploadingImages}
        hideLabel
      />

      <FormControl
        label="Layer name"
        type="text"
        value={activeLayer?.name || ""}
        onChange={changeName}
        className="mb-4"
        error={layerNameError}
        disabled={uploadingImages}
      />

      {/* Images */}
      <label className="form-title mb-2">
        {uploadingImages ? (
          <>
            <AiOutlineLoading size={20} className="loading-icon" />
            Uploading your images
          </>
        ) : (
          "Images"
        )}
      </label>

      <ImagesUploader
        onChange={changeImages}
        changeImageName={changeImageName}
        className="mb-4"
      />

      {/* <div className="row">
        <div className="col-md-4">
          <SelectBox
            label="Blend"
            value={activeLayer?.options.blend}
            onChange={chooseBlend}
            hint="You can play around with different blending modes"
          >
            {blendList.map((blend: any, index: number) => (
              <option key={`blend-${index}`} value={blend}>
                {blend}
              </option>
            ))}
          </SelectBox>
        </div>

        <div className="col-md-4">
          <RangeBox
            label="Opacity"
            value={activeLayer?.options.opacity}
            onChange={changeOpacity}
          />
        </div>

        <div className="col-md-4">
          <CheckBox
            checked={activeLayer?.options.bypassDNA}
            onCheck={toggleDNA}
            label="By Pass DNA"
            hint="If you want this layer to be ignored in the DNA uniqueness check, you can check By Pass DNA"
          />
        </div>
      </div> */}
    </div>
  )
}

export default LayerPanel
