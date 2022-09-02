import React, { useEffect, useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { nFormatter } from "../helpers/utils"
import PlanBlock from "./PlanBlock"
import { AnimationOnScroll } from "react-animation-on-scroll"

const PricingCalculator = ({ plans }: any) => {
  const f = plans[plans.length - 1]?.assetsNumber

  const [chance, setChance] = useState(0)
  const [results, setResults] = useState([])
  const [marks, setMarks] = useState({})
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const newMarks: any = {}
    plans.forEach((plan: any) => {
      const per = (plan.assetsNumber * 100) / f
      newMarks[per] = { label: nFormatter(plan.assetsNumber), style: markStyle }
    })

    setMarks(newMarks)
  }, [])

  useEffect(() => {
    const assetsNumber = (chance * f) / 100

    if (assetsNumber <= plans[0]?.assetsNumber) return setPrice(plans[0].price)

    for (let i = 0; i < plans.length; i++) {
      const p = plans[i]
      const nextP = plans[i + 1]

      if (!nextP) return setPrice(p.price)

      if (
        nextP &&
        assetsNumber > p.assetsNumber &&
        assetsNumber <= nextP.assetsNumber
      ) {
        return setPrice(nextP.price)
      }
    }
  }, [chance])

  const markStyle = {
    fontSize: "0.8rem",
    marginTop: "0.3em",
  }

  const handleSliderChange = (value: any) => {
    setResults([])
    setChance(value)
  }

  const currentCollectionSize = ((chance * f) / 100).toFixed(0)

  const getUsedPlan = () => {
    if (currentCollectionSize <= plans[0]?.assetsNumber) return plans[0]

    for (let i = 0; i < plans.length; i++) {
      const p = plans[i]
      const nextP = plans[i + 1]

      if (!nextP) return p

      if (
        nextP &&
        currentCollectionSize > p.assetsNumber &&
        currentCollectionSize <= nextP.assetsNumber
      ) {
        return nextP
      }
    }
  }

  return (
    <>
      <div className="row justify-content-center">
        {plans?.map((plan: any, i: number) => (
          <div key={`plan-${plan.id}`} className="col-lg-3 col-md-6 mb-4">
            <AnimationOnScroll
              animateIn="animate__fadeIn"
              delay={i * 100}
              animateOnce
            >
              <PlanBlock plan={plan} active={getUsedPlan().id === plan.id} />
            </AnimationOnScroll>
          </div>
        ))}
      </div>

      <AnimationOnScroll
        animateIn="animate__fadeIn"
        delay={200}
        animateOnce
      >
        <div className="pricing-calc mt-4">
          <h2>Price Calculator</h2>
          <p>Select your collection size to estimate costs.</p>

          <div className="mt-4 mb-5">
            <Slider
              trackStyle={{
                backgroundColor: "rgba(75, 75, 75, 0.1)",
              }}
              handleStyle={{
                backgroundColor: "#724bf4",
                borderColor: "#724bf4",
                height: 20,
                marginLeft: 0,
                marginTop: -8,
                width: 20,
              }}
              dotStyle={{ borderColor: "#724bf4" }}
              marks={marks}
              value={chance}
              onChange={handleSliderChange}
            />
          </div>

          <p>Your collection will have {currentCollectionSize} NFTs.</p>
          <p>
            The final cost will be <b>${price}</b>
            {getUsedPlan().priceToRemoveWatermark &&
              `, pay $${
                getUsedPlan().priceToRemoveWatermark
              } to remove watermark.`}
          </p>
        </div>
      </AnimationOnScroll>
    </>
  )
}

export default PricingCalculator
