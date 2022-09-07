import React from "react"
import CollectionI from "../types/CollectionI"
import CollectionBlock from "./CollectionBlock"

interface ListCollectionsProps {
  data: CollectionI[]
  setData: any
  count: number
  loading: boolean
  setQuery?: any
  duplicateCollection?: any
  deleteCollection?: any
}

const ListCollections = ({
  data,
  setData,
  count,
  loading,
  setQuery,
  duplicateCollection,
  deleteCollection,
}: ListCollectionsProps) => {
  const sortMyCollections = (e: any) => {
    const sortBy = e.target.value

    const sorted = data.slice().sort((collection1: any, collection2: any) => {
      const v1 =
        sortBy === "dateCreated"
          ? new Date(collection1[sortBy]).getTime()
          : collection1[sortBy]
      const v2 =
        sortBy === "dateCreated"
          ? new Date(collection2[sortBy]).getTime()
          : collection2[sortBy]

      if (sortBy === "collectionName") return v1 < v2 ? -1 : 1
      return v2 - v1
    })

    setData(sorted)
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div>
          <div className="form-group">
            <select className="form-select" onChange={sortMyCollections}>
              <option value="">Sort by</option>
              <option value="collectionName">Name</option>
              <option value="dateCreated">Latest</option>
              <option value="collectionSize">Largest</option>
            </select>
          </div>
        </div>

        {setQuery && (
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <p className="mb-3 paragraph">
        {count} collection{count !== 1 && "s"}
      </p>

      <div className="row">
        {duplicateCollection && (
          <div className="col-lg-3 col-md-4 col-6 mb-4">
            <CollectionBlock addNew />
          </div>
        )}

        {loading ? (
          <>
            {Array.from(Array(3).keys()).map(() => (
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <CollectionBlock loading />
              </div>
            ))}
          </>
        ) : (
          <>
            {data.map((c: any, index: number) => (
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <CollectionBlock
                  collection={c}
                  duplicateCollection={duplicateCollection}
                  deleteCollection={deleteCollection}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default ListCollections
