import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useState } from "react"
import AppContext from "../context/AppContext"
import { callApi, showToast } from "../helpers/utils"
import AppModal from "./AppModal"
import Button from "./Button"

interface ShareProps {
  showShare: boolean
  setShowShare: any
  collectionshare: any
}

const Share = ({ showShare, setShowShare, collectionshare }: ShareProps) => {
  const router = useRouter()
  const { id: collectionId }: any = router.query
  const { data: session }: any = useSession()

  const { collection } = useContext(AppContext)

  const [key, setKey] = useState(collectionshare?.id)
  const [isActive, setIsActive] = useState(collectionshare?.isActive)

  const currentLink = `${window.location.origin}/share/${collectionId}?key=${key}`

  const copy = () => {
    navigator.clipboard.writeText(currentLink)
    showToast("Share link copied to clipboard", "info")
  }

  const createNew = async () => {
    try {
      const { data } = await callApi({
        route: "me/newsharekey",
        body: {
          id: collectionId,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      const newKey = data.data.id
      setKey(newKey)

      showToast(data.message, "success")
    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  const handleActive = async (value: boolean) => {
    try {
      const { data } = await callApi({
        route: "me/handleactivesharekey",
        body: {
          key,
          isActive: value,
        },
      })

      if (!data.success) return showToast(data.message, "error")
      setIsActive(value)
    } catch (error: any) {
      showToast(error.message, "error")
    }
  }

  return (
    <AppModal
      show={showShare}
      onHide={() => setShowShare(false)}
      size="sm"
      title="Share collection with others"
    >
      <div className="share-collection">
        <p className="paragraph smaller mt-0 mb-3">
          Anyone with the link can preview your collection, but will not be able
          to edit it.
        </p>

        <div className="active-inactive">
          <button
            className={isActive ? "active" : ""}
            onClick={() => handleActive(true)}
          >
            Active
          </button>
          <button
            className={!isActive ? "active" : ""}
            onClick={() => handleActive(false)}
          >
            Inactive
          </button>
        </div>

        {isActive && (
          <>
            <div className="copy-clipboard mt-3 mb-3">
              <div className="form-group m-0">
                <input
                  type="text"
                  className="form-control"
                  value={currentLink}
                />
              </div>
              <Button className="btn-sm" onClick={copy}>
                Copy
              </Button>
            </div>

            <Button className="btn-sm btn-outline" onClick={createNew}>
              Create new link
            </Button>
          </>
        )}

        {collection?.userId === session?.user?.id && (
          <div className="mt-3">
            <Button
              className="btn-xs btn-outline"
              to={`/app/${collection?.id}/collaborators`}
            >
              Add collaborators
            </Button>
          </div>
        )}
      </div>
    </AppModal>
  )
}

export default Share
