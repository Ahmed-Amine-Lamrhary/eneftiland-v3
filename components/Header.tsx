import NavLink from "./NavLink"
import { AiOutlineShareAlt } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { useContext, useEffect } from "react"
import PageContext from "../context/PageContext"
import { signOut, useSession } from "next-auth/react"
import { RiAccountPinCircleLine } from "react-icons/ri"

export default function Header({
  children,
  setShowShare,
  isFixed,
  isCollaborator,
}: any) {
  const { setShowAuthModal, settings } = useContext(PageContext)
  const { data: session } = useSession()

  const businessName = settings?.businessName ? settings?.businessName : ""

  const myAccountBtn = () => (
    <ul className="navbar-nav myAccountBtn">
      {session && (
        <>
          {setShowShare && (
            <button
              className="nav-btn share-btn"
              onClick={() => setShowShare(true)}
            >
              <AiOutlineShareAlt /> <span>share</span>
            </button>
          )}

          {isCollaborator && (
            <div className="nav-btn">
              <span className="badge">Collaborator</span>
            </div>
          )}

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDarkDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>
                <span className="user-avatar-name">
                  <span className="user-icon me-1">
                    <RiAccountPinCircleLine size={25} />
                  </span>
                  <span className="name">{session?.user?.name}</span>
                </span>
              </span>
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDarkDropdownMenuLink"
            >
              <li>
                <NavLink className="dropdown-item" to="/account">
                  Your Account
                </NavLink>
              </li>

              <li>
                <NavLink
                  className="dropdown-item logout"
                  to=""
                  onClick={signOut}
                >
                  <FiLogOut /> Logout
                </NavLink>
              </li>
            </ul>
          </li>
        </>
      )}
    </ul>
  )

  useEffect(() => {
    document.addEventListener("scroll", () => {
      let navbar = document.querySelector(".navbar")
      if (window.scrollY > 40) {
        navbar?.classList.add("scrolled")
      } else {
        navbar?.classList.remove("scrolled")
      }
    })
  }, [])

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-light ${
        isFixed ? "fixed" : ""
      }`}
    >
      <div
        className={`${!isFixed ? "container-fluid" : "container"}`}
        style={children ? { flexWrap: "nowrap" } : {}}
      >
        <NavLink className="navbar-brand" to="/">
          <div className="contain">
            <img src={settings?.logoUrl} className="navbar-brand-logo" />
            <span className="text">{businessName}</span>
          </div>

          {settings?.isBeta && <span className="beta">Beta</span>}
        </NavLink>

        <div className="d-flex">
          {children}

          {!children && (
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          )}

          <div className="d-sm-block d-lg-none">{myAccountBtn()}</div>
        </div>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent"
        >
          <div className="mr-auto" />

          <ul className="navbar-nav my-2 my-lg-0">
            {!children && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/#how-it-works">
                    How it works
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/#features">
                    Features
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/#pricing">
                    Pricing
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/lifetime-deal">
                    Lifetime Deal
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/#faq">
                    FAQ
                  </NavLink>
                </li>
              </>
            )}

            {!session && (
              <>
                <li className="nav-item login-nav-item">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="nav-link btn"
                  >
                    Login to start
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="d-none d-lg-block">{myAccountBtn()}</div>
      </div>
    </nav>
  )
}
