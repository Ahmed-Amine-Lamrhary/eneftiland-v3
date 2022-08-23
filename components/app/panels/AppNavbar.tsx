import React, { useContext, useEffect, useState } from "react"
import { FiLayers, FiLogOut, FiSettings } from "react-icons/fi"
import { HiOutlineCollection } from "react-icons/hi"
import { BiImage } from "react-icons/bi"
import { AiOutlineLoading3Quarters, AiOutlineUser } from "react-icons/ai"
import { RiPencilRuler2Line } from "react-icons/ri"
import AppContext from "../../../context/AppContext"
import NavLink from "../../NavLink"
import { useWeb3React } from "@web3-react/core"
import { removeConnectedUser, showToast } from "../../../helpers/utils"
import axios from "axios"
import { BsCheck2 } from "react-icons/bs"

const AppNavbar = () => {
  const { active, account, activate, deactivate } = useWeb3React()
  const {
    view,
    setView,
    uploadingFolder,
    isSaving,
    collection,
    uploadingImages,
  } = useContext(AppContext)

  const [myCollections, setMyCollections] = useState<any>([])
  const [getLoading, setGetLoading] = useState(false)

  useEffect(() => {
    if (account) getMyCollections()
  }, [account])

  const handleSignout = async (e: any) => {
    e.preventDefault()
    removeConnectedUser()
    deactivate()
  }

  const getMyCollections = async () => {
    try {
      setGetLoading(true)
      const { data }: any = await axios.post("/api/me/mycollections", {
        address: account,
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

  return (
    <div className="app-sidebar">
      <ul>
        <li>
          <button
            type="button"
            className={view === "designer" ? "active" : ""}
            onClick={() => setView("designer")}
            disabled={disableButtons}
          >
            <FiLayers />
            <span className="text">Designer</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={view === "settings" ? "active" : ""}
            onClick={() => setView("settings")}
            disabled={disableButtons}
          >
            <FiSettings />
            <span className="text">Settings</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={view === "rules" ? "active" : ""}
            onClick={() => setView("rules")}
            disabled={disableButtons}
          >
            <RiPencilRuler2Line />
            <span className="text">Rules</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            className={view === "preview" ? "active" : ""}
            onClick={() => setView("preview")}
            disabled={disableButtons}
          >
            <HiOutlineCollection />
            <span className="text">Gallery</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={view === "generate" ? "active" : ""}
            onClick={() => setView("generate")}
            disabled={disableButtons}
          >
            <BiImage />
            <span className="text">Generate</span>
          </button>
        </li>
      </ul>

      <ul>
        {isSaving && (
          <li>
            <button type="button" disabled>
              <AiOutlineLoading3Quarters className="loading-icon" />

              <span className="text">Saving...</span>
            </button>
          </li>
        )}

        {/* other collections */}
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDarkDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="d-none d-md-inline-block">
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

        {/* account */}
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDarkDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="d-none d-md-inline-block">
              <span className="user-avatar-name">
                {account &&
                  `${account?.substring(0, 6)}...${account?.substring(
                    account?.length - 4,
                    account?.length
                  )}`}
              </span>
            </span>
          </a>
          <ul
            className="dropdown-menu"
            aria-labelledby="navbarDarkDropdownMenuLink"
          >
            <li>
              <NavLink className="dropdown-item" to="/account">
                <AiOutlineUser /> Your Account
              </NavLink>
            </li>

            <li>
              <NavLink
                className="dropdown-item logout"
                to=""
                onClick={handleSignout}
              >
                <FiLogOut /> Disconnect wallet
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default AppNavbar
