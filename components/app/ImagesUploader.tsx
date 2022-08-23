import React, { useContext } from "react"
import ImageUploading from "react-images-uploading"
import AppContext from "../../context/AppContext"
import ImageBlock from "./ImageBlock"

interface ImagesUploaderProps {
  onChange: any
  className?: string
  changeImageName: any
}

const ImagesUploader = ({
  onChange,
  className,
  changeImageName,
}: ImagesUploaderProps) => {
  const { collection, activeLayerId, uploadingImages } = useContext(AppContext)
  const layers = collection?.layers ? [...collection?.layers] : []
  const activeLayer = layers.find((layer) => layer.id === activeLayerId)

  return (
    <div className={`images-uploader ${className}`}>
      <ImageUploading
        multiple
        value={activeLayer?.images || []}
        onChange={onChange}
        dataURLKey="url"
        acceptType={["png", "svg", "jpg", "jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <>
            <div className="image-items row">
              {uploadingImages && <div className="uploading" />}

              {activeLayer?.images?.map((image, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-3">
                  <ImageBlock
                    image={image}
                    index={index}
                    onImageUpdate={onImageUpdate}
                    onImageRemove={onImageRemove}
                    onChange={onChange}
                    newImageList={imageList}
                    changeImageName={changeImageName}
                  />
                </div>
              ))}
            </div>

            <button
              className={`box upload-btn ${
                isDragging ? "dragging" : undefined
              }`}
              onClick={onImageUpload}
              {...dragProps}
              disabled={uploadingImages}
            >
              Click or drop images here
              <p>(png, jpg, jpeg, svg)</p>
            </button>
          </>
        )}
      </ImageUploading>
    </div>
  )
}

export default ImagesUploader
