import React, { useContext, useEffect } from "react"
import { FiLayers, FiSettings } from "react-icons/fi"
import { HiOutlineCollection } from "react-icons/hi"
import { BiImage } from "react-icons/bi"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { RiPencilRuler2Line } from "react-icons/ri"
import AppContext from "../../../context/AppContext"
import Button from "../../Button"
import { useRouter } from "next/router"
import AppSelect from "../AppSelect"
import { useSession } from "next-auth/react"

const AppNavbar = () => {
  const { status } = useSession()
  const router = useRouter()

  const {
    uploadingFolder,
    isSaving,
    collection,
    uploadingImages,
    view,
    setView,
  } = useContext(AppContext)

  // const [myCollections, setMyCollections] = useState<any>([])
  // const [getLoading, setGetLoading] = useState(false)

  useEffect(() => {
    // if (status === "authenticated") getMyCollections()
  }, [status])

  // const getMyCollections = async () => {
  //   try {
  //     setGetLoading(true)

  //     const { data } = await callApi({
  //       route: "me/mycollections",
  //     })

  //     if (!data.success) return showToast(data.message, "error")

  //     setMyCollections(data.data.filter((c: any) => c.id !== collection?.id))
  //   } catch (error: any) {
  //     throw error
  //   } finally {
  //     setGetLoading(false)
  //   }
  // }

  const disableButtons = uploadingFolder || isSaving || uploadingImages

  const renderBtn = (route: string, Icon: any) => (
    <Button
      className={view === route ? "active" : ""}
      disabled={disableButtons}
      onClick={() => {
        router.push(
          {
            pathname: `/app/${collection?.id}`,
            query: { page: route },
          },
          undefined,
          { scroll: false }
        )

        setView(route)
      }}
    >
      <Icon />
      <span className="text">{route}</span>
    </Button>
  )

  const viewsList = [
    {
      value: "layers",
      label: <>{renderBtn("layers", FiLayers)}</>,
    },
    {
      value: "settings",
      label: <>{renderBtn("settings", FiSettings)}</>,
    },
    {
      value: "rules",
      label: <>{renderBtn("rules", RiPencilRuler2Line)}</>,
    },
    {
      value: "gallery",
      label: <>{renderBtn("gallery", HiOutlineCollection)}</>,
    },
    {
      value: "generate",
      label: <>{renderBtn("generate", BiImage)}</>,
    },
  ]

  return (
    <ul className="navbar-nav app-navbar-nav">
      {/* other collections */}
      {/* <li className="nav-item dropdown other-collections-dropdown">
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
      </li> */}

      {/* views */}
      <AppSelect
        options={viewsList}
        value={viewsList?.find((v: any) => v.value === view)}
        onChange={(e: any) => setView(e.value)}
        placeholder=""
        isSearchable={false}
      />

      <ul>
        <li className="nav-item">{renderBtn("layers", FiLayers)}</li>
        <li className="nav-item">{renderBtn("settings", FiSettings)}</li>
        <li className="nav-item">{renderBtn("rules", RiPencilRuler2Line)}</li>
        <li className="nav-item">
          {renderBtn("gallery", HiOutlineCollection)}
        </li>
        <li className="nav-item">{renderBtn("generate", BiImage)}</li>
      </ul>

      {isSaving && (
        <li className="nav-item ms-2" style={{ padding: "7px 0" }}>
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
