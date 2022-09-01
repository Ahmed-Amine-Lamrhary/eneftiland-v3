import React from "react"
import { FiCheckCircle } from "react-icons/fi"
import { plansFeaturesDelimiter } from "../helpers/constants"
import PlanI from "../types/admin/PlanI"

interface PlanBlockProps {
  plan: PlanI
  active?: boolean
}

const PlanBlock = ({ plan, active = false }: PlanBlockProps) => {
  const { assetsNumber, price, features, priceToRemoveWatermark } = plan

  return (
    <div className={`plan-block ${active ? "active" : ""}`}>
      <div className="top">
        <div className="up-to">UP TO</div>
        <div className="plan-size">{assetsNumber}</div>
        <div className="asset-generated">Tokens Generated</div>
        <span className="plan-price">{price === 0 ? "Free" : "$" + price}</span>
        <br />

        <i className="per-collection">Per Collection</i>
      </div>

      {features && features.length > 0 && (
        <ul className="plan-features">
          {features?.split(plansFeaturesDelimiter).map((feature) => (
            <li key={`plan-feature-${feature}`}>
              <FiCheckCircle /> {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PlanBlock
