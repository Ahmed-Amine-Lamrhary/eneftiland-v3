import React from "react"
import { FiCheckCircle } from "react-icons/fi"
import Button from "./Button"

const LifetimePlan = () => {
  const features = [
    "Unlimited tokens generated",
    "Access to all upcoming features",
  ]

  return (
    <div className="plan-block">
      <div className="top">
        <h5 className="mb-0">Lifetime Deal</h5>
        <hr />
        <p className="paragraph mt-2 mb-2">One-time purchase of</p>
        <span className="plan-price">$99</span>
      </div>

      <ul className="plan-features">
        {features.map((feature) => (
          <li key={`plan-feature-${feature}`}>
            <FiCheckCircle /> {feature}
          </li>
        ))}
      </ul>

      <div className="pb-3">
        <Button className="btn-sm" to="https://appsumo.com/" target="_blank">
          Get the coupon
        </Button>
      </div>
    </div>
  )
}

export default LifetimePlan
