import NavLink from "./NavLink"
import { AiOutlineUser } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { removeConnectedUser } from "../helpers/utils"
import { FaRegUserCircle } from "react-icons/fa"
import { useWeb3React } from "@web3-react/core"
import { useContext } from "react"
import PageContext from "../context/PageContext"
import GetStartedButton from "./GetStartedButton"
import NetworkSwitcher from "./NetworkSwitcher"

export default function Header({ children }: any) {
  const { setShowAuthModal, settings } = useContext(PageContext)
  const { active, account, deactivate } = useWeb3React()

  const businessName = settings?.businessName ? settings?.businessName : ""

  const handleSignout = async (e: any) => {
    e.preventDefault()
    removeConnectedUser()
    deactivate()
  }

  const myAccountBtn = () => (
    <ul className="navbar-nav myAccountBtn">
      {active && (
        <>
          <li className="nav-item me-2 ms-2">
            <NetworkSwitcher />
          </li>

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
                  {`${account?.substring(0, 6)}...${account?.substring(
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
          {!children && (
            <NavLink className="navbar-brand" to="/">
              {settings?.logoUrl ? (
                <img src={settings?.logoUrl} className="navbar-brand-logo" />
              ) : (
                businessName
              )}
            </NavLink>
          )}

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

              {!active && (
                <>
                  <li className="nav-item">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="nav-link btn"
                    >
                      <FaRegUserCircle size={20} className="me-2" />
                      Connect wallet
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
