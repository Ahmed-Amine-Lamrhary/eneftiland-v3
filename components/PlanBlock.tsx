import React from "react"
import { BsCheck } from "react-icons/bs"
import { plansFeaturesDelimiter } from "../helpers/constants"
import PlanI from "../types/admin/PlanI"

interface PlanBlockProps {
  plan: PlanI
  currencyCode?: string
}

const PlanBlock = ({ plan, currencyCode = "USD" }: PlanBlockProps) => {
  const { assetsNumber, price, features, priceToRemoveWatermark } = plan

  return (
    <div className="plan-block">
      <div className="top">
        <div className="up-to">UP TO</div>
        <div className="plan-size">{assetsNumber}</div>
        <div className="asset-generated">Tokens Generated</div>
        <span className="plan-price">
          {price === 0 ? "Free" : price + currencyCode}
        </span>
        <br />

        <i className="per-collection">Per Collection</i>

        {priceToRemoveWatermark && (
          <p className="paragraph">
            Pay {priceToRemoveWatermark} {currencyCode} to remove watermark
          </p>
        )}
      </div>

      {features && features.length > 0 && (
        <ul className="plan-features">
          {features?.split(plansFeaturesDelimiter).map((feature) => (
            <li key={`plan-feature-${feature}`}>
              <BsCheck /> {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PlanBlock
