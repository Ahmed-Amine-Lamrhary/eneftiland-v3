import Link from "next/link"
import React from "react"
import { Dropdown } from "react-bootstrap"
import { AiOutlinePlus } from "react-icons/ai"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { FiTrash2 } from "react-icons/fi"
import { HiOutlineDuplicate } from "react-icons/hi"
import { MdOutlineCollections } from "react-icons/md"
import ImgHolder from "./app/ImgHolder"

interface CollectionBlockProps {
  collection?: any
  duplicateCollection?: any
  deleteCollection?: any
  addNew?: boolean
  onClick?: any
  loading?: boolean
}

const CollectionBlock = ({
  collection,
  duplicateCollection,
  deleteCollection,
  addNew = false,
  onClick,
  loading,
}: CollectionBlockProps) => {
  if (loading)
    return (
      <div className="collection-block collection-loading">
        <div className="img-container">
          <div className="img-holder loading-img-holder" />
          <div className="icon" />
        </div>

        <div className="collection-name">
          <span className="invisible">Collection</span>
        </div>
      </div>
    )

  return (
    <div className="collection-block" onClick={onClick}>
      {!addNew && (
        <>
          <Link href={`/app/${collection.id}`}>
            <a>
              {collection.results && (
                <div className="img-container">
                  <ImgHolder
                    attributes={collection.results[0]?.attributes}
                    layers={collection.galleryLayers}
                  />

                  {collection.results.length === 0 && (
                    <div className="icon">
                      <MdOutlineCollections size={60} />
                    </div>
                  )}
                </div>
              )}

              <div className="collection-size">
                {collection.results.length} items
              </div>

              <div className="collection-name">{collection.collectionName}</div>
            </a>
          </Link>

          {(duplicateCollection || deleteCollection) && (
            <Dropdown className="collection-dropdown" align="end">
              <Dropdown.Toggle>
                <BiDotsVerticalRounded />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {duplicateCollection && (
                  <Dropdown.Item
                    onClick={() => duplicateCollection(collection.id)}
                  >
                    <HiOutlineDuplicate /> Duplicate
                  </Dropdown.Item>
                )}

                {deleteCollection && (
                  <Dropdown.Item
                    onClick={() => deleteCollection(collection.id)}
                  >
                    <FiTrash2 /> Delete
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </>
      )}

      {addNew && (
        <Link href={`/app`}>
          <a>
            <div className="img-container">
              <div className="img-holder"></div>
              <div className="icon">
                <AiOutlinePlus size={30} />
              </div>
            </div>

            <div className="collection-name">Create New</div>
          </a>
        </Link>
      )}
    </div>
  )
}

export default CollectionBlock
