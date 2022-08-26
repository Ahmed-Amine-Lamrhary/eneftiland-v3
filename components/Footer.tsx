import React, { useContext } from "react"
import { AiFillInstagram } from "react-icons/ai"
import { BsLinkedin, BsTwitter, BsYoutube } from "react-icons/bs"
import { FaDiscord } from "react-icons/fa"
import PageContext from "../context/PageContext"
import NavLink from "./NavLink"

const Footer = () => {
  const { settings } = useContext(PageContext)
  const businessName = settings?.businessName ? settings?.businessName : ""

  return (
    <footer className="footer">
      <div className="container-lg">
        {/* main */}
        <div className="main row">
          <div className="col-md-3 col-sm-6 mb-3">
            <h6>Social Media</h6>
            <ul className="links-list sm d-flex">
              <li>
                <a href="" target="_blank">
                  <BsTwitter />
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <FaDiscord />
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <BsYoutube />
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <AiFillInstagram />
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <BsLinkedin />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-3">
            <h6>Legal</h6>
            <ul className="links-list">
              <li>
                <NavLink to="/terms-of-use">Terms of use</NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy">Privacy policy</NavLink>
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-3">
            <h6>Links</h6>
            <ul className="links-list">
              <li>
                <NavLink to="/">About us</NavLink>
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-3">
            <h6>Products</h6>
            <ul className="links-list">
              <li>
                <NavLink to="/">NFT generator</NavLink>
              </li>
              <li>
                <NavLink to="/">
                  Smart contract <span>soon</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* copyright */}
        <div className="copyright text-center">
          <p>
            &copy;{new Date().getFullYear()} All Rights Reserved. {businessName}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
