import React, { useContext, useEffect, useState } from "react"
import { BiCheck } from "react-icons/bi"
import { callApi, convertToEth } from "../../helpers/utils"
import Metamask from "./Metamask"
import Image from "next/image"
import AppContext from "../../context/AppContext"
import payMethodsType from "../../types/payMethods"
import { useWeb3React } from "@web3-react/core"

import metamaskIcon from "../../assets/icons/metamask.png"

import Razorpay from "./Razorpay"
import Paypal from "./Paypal"
import Stripe from "./Stripe"
import { CURRENCY } from "../../helpers/constants"
import Button from "../Button"
import CheckBox from "../app/CheckBox"
import { BsPaypal } from "react-icons/bs"
import { FaStripeS } from "react-icons/fa"
import { SiRazorpay } from "react-icons/si"

interface PayProps {
  description: string
  currentPlan: any
  generate: any
  setShowPayment: any
  paymentMethod: payMethodsType
  setPaymentMethod: any
}

const Pay = ({
  description,
  currentPlan,
  generate,
  setShowPayment,
  paymentMethod,
  setPaymentMethod,
}: PayProps) => {
  const { active, account, activate, deactivate } = useWeb3React()

  const [amount, setAmount] = useState(currentPlan.price)
  const [payText, setPayText] = useState("")
  const { settings, collection } = useContext(AppContext)

  useEffect(() => {
    setPaymentMethod("metamask")
  }, [])

  useEffect(() => {
    getAmount().then((a: any) => {
      setPayText(`Pay ${a} with ${paymentMethod?.toUpperCase()}`)
    })
  }, [paymentMethod, amount])

  const getAmount = async () => {
    if (paymentMethod === "metamask") {
      const ethAmount = await convertToEth(amount, CURRENCY)
      return Number.parseFloat(ethAmount.toFixed(3)) + " ETH"
    }

    return amount + " " + CURRENCY
  }

  const paymentMehodItem = (method: payMethodsType) => (
    <li className={`${paymentMethod === method ? "active" : ""}`}>
      <button onClick={() => setPaymentMethod(method)}>
        <div className="me-2">
          {method === "metamask" && (
            <Image src={metamaskIcon} width={20} height={20} />
          )}
          {method === "paypal" && <BsPaypal />}
          {method === "razorpay" && <SiRazorpay />}
          {method === "stripe" && <FaStripeS />}
        </div>
        {method}
      </button>
    </li>
  )

  const finishPayment = async () => {
    const ethAmount = await convertToEth(amount, CURRENCY)

    // save the transaction
    if (ethAmount > 0 && amount > 0)
      await callApi({
        route: "transactions/add",
        body: {
          address: account,
          label: `Generated ${collection?.results?.length} tokens`,
          amount: paymentMethod === "metamask" ? ethAmount : amount,
          method: paymentMethod ? paymentMethod : null,
          currency: paymentMethod === "metamask" ? "ETH" : CURRENCY,
        },
      })

    await generate({ isWatermark: false })
  }

  return (
    <div className="app-panel pb-4">
      <div className="container">
        <p className="paragraph mt-0 mb-3">
          See our pricing{" "}
          <a target={"_blank"} href="/#pricing-section">
            here
          </a>
        </p>

        {paymentMethod === undefined ? (
          <>
            <p>No payment method is available</p>
          </>
        ) : (
          <>
            {amount > 0 && <p className="paragraph mb-4">{payText}</p>}

            {/* remove watermark if collection is smaller or equal to assets number */}
            {currentPlan.priceToRemoveWatermark &&
              currentPlan.priceToRemoveWatermark > 0 && (
                <div>
                  <CheckBox
                    hideLabel
                    checked={amount === currentPlan.priceToRemoveWatermark}
                    onCheck={(e: any) =>
                      setAmount(
                        e.target.checked
                          ? currentPlan.priceToRemoveWatermark
                          : currentPlan.price
                      )
                    }
                    label={`My collection is smaller or equal to ${collection?.collectionSize}`}
                    hint={`If your collection is smaller or equal to ${collection?.collectionSize}, you can pay ${currentPlan.priceToRemoveWatermark}${CURRENCY} to remove the watermark`}
                  />

                  {amount === 0 && (
                    <div className="text-center mt-3">
                      <Button className="btn-sm" onClick={generate}>
                        Generate with watermark
                      </Button>
                    </div>
                  )}
                </div>
              )}

            {/* Payment */}
            {amount > 0 && (
              <div>
                <div>
                  <ul className="select-payment-methods">
                    {settings?.isPaypal && paymentMehodItem("paypal")}
                    {settings?.isMetamask && paymentMehodItem("metamask")}
                    {settings?.isStripe && paymentMehodItem("stripe")}
                    {settings?.isRazorpay && paymentMehodItem("razorpay")}
                  </ul>
                </div>
                <div className="selected-payment-method">
                  {settings?.isPaypal && paymentMethod === "paypal" && (
                    <Paypal
                      description={description}
                      amount={amount}
                      generate={finishPayment}
                    />
                  )}

                  {settings?.isMetamask && paymentMethod === "metamask" && (
                    <Metamask
                      amount={amount}
                      generate={finishPayment}
                      myMetamaskAddress={settings?.metamaskAddress}
                    />
                  )}

                  {settings?.isStripe && paymentMethod === "stripe" && (
                    <Stripe
                      description={description}
                      amount={amount}
                      generate={finishPayment}
                    />
                  )}

                  {settings?.isRazorpay && paymentMethod === "razorpay" && (
                    <Razorpay
                      description={description}
                      amount={amount}
                      generate={finishPayment}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Pay
