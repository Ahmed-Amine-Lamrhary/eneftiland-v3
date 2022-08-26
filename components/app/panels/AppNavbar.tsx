import React, { useContext, useEffect, useState } from "react"
import { FiLayers, FiSettings } from "react-icons/fi"
import { HiOutlineCollection } from "react-icons/hi"
import { BiImage } from "react-icons/bi"
import { AiOutlineLoading3Quarters, AiOutlineUser } from "react-icons/ai"
import { RiPencilRuler2Line } from "react-icons/ri"
import AppContext from "../../../context/AppContext"
import NavLink from "../../NavLink"
import { useWeb3React } from "@web3-react/core"
import { callApi, showToast } from "../../../helpers/utils"
import { BsCheck2 } from "react-icons/bs"
import { useRouter } from "next/router"

const AppNavbar = () => {
  const { account } = useWeb3React()

  const router = useRouter()

  const { uploadingFolder, isSaving, collection, uploadingImages } =
    useContext(AppContext)

  const [myCollections, setMyCollections] = useState<any>([])
  const [getLoading, setGetLoading] = useState(false)

  useEffect(() => {
    if (account) getMyCollections()
  }, [account])

  const getMyCollections = async () => {
    try {
      setGetLoading(true)

      const { data } = await callApi({
        route: "me/mycollections",
        body: {
          address: account,
        },
      })

      if (!data.success) return showToast(data.message, "error")

      setMyCollections(data.data.filter((c: any) => c.id !== collection?.id))
    } catch (error: any) {
      throw error
    } finally {
      setGetLoading(false)
    }
  }

  const disableButtons = uploadingFolder || isSaving || uploadingImages

  const renderBtn = (route: string, Icon: any) => (
    <button
      type="button"
      className={
        router.asPath === `/app/${collection?.id}/${route}` ? "active" : ""
      }
      onClick={() => router.push(`/app/${collection?.id}/${route}`)}
      disabled={disableButtons}
    >
      <Icon />
      <span className="text">{route}</span>
    </button>
  )

  return (
    <ul className="navbar-nav app-navbar-nav">
      {/* other collections */}
      <li className="nav-item dropdown other-collections-dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDarkDropdownMenuLink"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="">
            <span className="user-avatar-name">My collections</span>
          </span>
        </a>
        <ul
          className="dropdown-menu"
          aria-labelledby="navbarDarkDropdownMenuLink"
        >
          <li>
            <NavLink className="dropdown-item" to={`/app/${collection?.id}`}>
              <BsCheck2 /> {collection?.collectionName}
            </NavLink>
          </li>

          {myCollections.map((c: any) => (
            <li>
              <a className="dropdown-item" href={`/app/${c.id}`}>
                {c.collectionName}
              </a>
            </li>
          ))}

          <div className="dropdown-divider"></div>

          <li>
            <NavLink className="dropdown-item" to="/app">
              Create collection
            </NavLink>
          </li>
        </ul>
      </li>

      {/*  */}
      <ul>
        <li className="nav-item me-2">{renderBtn("layers", FiLayers)}</li>
        <li className="nav-item me-2">{renderBtn("settings", FiSettings)}</li>
        <li className="nav-item me-2">
          {renderBtn("rules", RiPencilRuler2Line)}
        </li>
        <li className="nav-item me-2">
          {renderBtn("gallery", HiOutlineCollection)}
        </li>
        <li className="nav-item me-2">{renderBtn("generate", BiImage)}</li>
      </ul>

      {isSaving && (
        <li className="nav-item">
          <button type="button" disabled>
            <AiOutlineLoading3Quarters className="loading-icon" />

            <span className="text">Saving...</span>
          </button>
        </li>
      )}
    </ul>
  )
}

export default AppNavbar
