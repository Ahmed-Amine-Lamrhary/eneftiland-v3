import React, { useEffect, useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

const PricingCalculator = ({ plans, currency }: any) => {
  const f = plans[plans.length - 1]?.assetsNumber

  const [chance, setChance] = useState(0)
  const [results, setResults] = useState([])
  const [marks, setMarks] = useState({})
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const newMarks: any = {
      0: { label: "0", style: markStyle },
    }
    plans.forEach((plan: any) => {
      const per = (plan.assetsNumber * 100) / f
      newMarks[per] = { label: plan.assetsNumber + "", style: markStyle }
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

  return (
    <div className="pricing-calc">
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

      <p>Your collection will have {(chance * f) / 100} NFTs.</p>
      <p>
        The final cost will be{" "}
        <b>
          {price} {currency}
        </b>
      </p>
    </div>
  )
}

export default PricingCalculator
