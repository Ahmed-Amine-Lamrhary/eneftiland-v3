import NavLink from "./NavLink"
import { AiOutlineUser } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { FaRegUserCircle } from "react-icons/fa"
import { useContext } from "react"
import PageContext from "../context/PageContext"
import GetStartedButton from "./GetStartedButton"
import { signOut, useSession } from "next-auth/react"

export default function Header({ children }: any) {
  const { setShowAuthModal, settings } = useContext(PageContext)
  const { data: session } = useSession()

  const businessName = settings?.businessName ? settings?.businessName : ""

  const myAccountBtn = () => (
    <ul className="navbar-nav myAccountBtn">
      {session && (
        <>
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
                <span className="user-avatar-name">{session?.user?.name}</span>
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

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div
          className="container-fluid"
          style={children ? { flexWrap: "nowrap" } : {}}
        >
          <NavLink className="navbar-brand" to="/">
            {settings?.logoUrl ? (
              <img src={settings?.logoUrl} className="navbar-brand-logo" />
            ) : (
              businessName
            )}
            {settings?.isBeta && <span className="beta">Beta</span>}
          </NavLink>

          {children}

          <div className="d-flex">
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

            <div className="d-sm-block d-md-none">{myAccountBtn()}</div>
          </div>

          <div
            className="collapse navbar-collapse justify-content-between"
            id="navbarSupportedContent"
          >
            <div className="mr-auto" />

            <ul className="navbar-nav my-2 my-lg-0">
              {!children && (
                <>
                  <li className="nav-item me-2">
                    <GetStartedButton className="btn-sm btn-outline">
                      Generate Collection
                    </GetStartedButton>
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
                </>
              )}

              {!session && (
                <>
                  <li className="nav-item">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="nav-link btn"
                    >
                      <FaRegUserCircle size={20} className="me-2" />
                      Login to start
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="d-none d-md-block">{myAccountBtn()}</div>
        </div>
      </nav>
    </>
  )
}
